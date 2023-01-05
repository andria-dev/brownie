import unified from 'unified'
import remark from 'remark-parse'

import frontmatter from 'remark-frontmatter'
import {parse as yaml} from 'yaml'

import extractFrontmatter from 'remark-extract-frontmatter'
import filter from 'unist-util-filter'

import map from 'unist-util-map'
import prism from 'remark-prism'

import toHTML from 'remark-html'
import readingTime from 'reading-time'

import fs, {promises as fsp} from 'fs'
import {join} from 'path'
import {escapeHtml} from './utils/escape-html'
import chokidar from 'chokidar'
import {debounce} from 'mini-debounce'

import {render, Text, Box} from 'ink'
import {html} from 'htm/react'
import {useEffect, useReducer} from 'react'
import minimist from 'minimist'

async function getSlugs() {
	const entities = await fsp.readdir(join(process.cwd(), './public/blog'), {
		withFileTypes: true,
	})
	return entities
		.filter((entity) => entity.isDirectory())
		.map((entity) => entity.name)
}

function getRawPost(slug) {
	return fsp.readFile(join(process.cwd(), './public/blog', slug, 'index.md'), {
		encoding: 'utf8',
	})
}

async function getRawPosts() {
	const rawPosts = {}
	for (const slug of await getSlugs()) {
		rawPosts[slug] = await getRawPost(slug)
	}
	return rawPosts
}

async function parsePosts(posts) {
	const parsedPosts = []

	for (const slug in posts) {
		const parsedPost = await parse(slug, posts[slug])
		if (parsedPost !== null) parsedPosts.push(parsedPost)
	}

	return parsedPosts
}

function parse(slug, rawPost) {
	return unified()
		.use(remark)
		.use(frontmatter)
		.use(extractFrontmatter, {yaml})
		.use(function removeFrontmatter() {
			return (tree) => filter(tree, (node) => node.type !== 'yaml')
		})
		.use(() => {
			return (tree) =>
				map(tree, (node) => {
					if (node.type === 'inlineCode') {
						// Handle inline code blocks for Prism since remark-prism won't
						const value = escapeHtml(node.value)
						return {
							type: 'html',
							value: `<code class="language-text">${value}</code>`,
						}
					} else {
						return node
					}
				})
		})
		.use(prism, {transformInlineCode: true})
		.use(toHTML)
		.process(rawPost)
		.then((result) => ({
			slug,
			content: {
				title: result.data.title,
				description: result.data.description || null,
				html: result.contents,
			},
			stats: {
				date: result.data.date,
				published: result.data.published,
				timeToRead: readingTime(rawPost),
			},
		}))
		.catch((error) => {
			console.error(error)
			return null
		})
}

function sortPosts(posts) {
	// descending order (newest first)
	return posts.sort((postA, postB) => {
		return new Date(postB.stats.date) - new Date(postA.stats.date)
	})
}

function addPageContext(posts) {
	return posts.map((post, index, {length}) => {
		return {
			...post,
			context: {
				previous: index > 0 ? posts[index - 1] : null,
				next: index < length - 1 ? posts[index + 1] : null,
			},
		}
	})
}

function filterPosts(posts) {
	if (process.env.NODE_ENV === 'production') {
		return posts.filter((post) => post && post.stats.published)
	}
	return posts.filter((post) => post)
}

function organizePosts(posts) {
	posts = sortPosts(posts)
	posts = addPageContext(posts)
	posts = filterPosts(posts)
	return posts
}

function getPosts() {
	return getRawPosts().then(parsePosts).then(organizePosts)
}

// Caching to make DX better.
let initialPosts = []
try {
	initialPosts = JSON.parse(fs.readFileSync('posts-cache.json'))
} catch {
	// If posts-cache.json was never created, build now.
	getPosts().then((posts) => {
		initialPosts = posts
		savePosts(posts)
	})
}

const savePosts = debounce((posts) => {
	fsp.writeFile('posts-cache.json', JSON.stringify(posts))
}, 500)

// Get the latest posts right away.
// getPosts().then((posts) => {
// 	postsCache = posts
// 	savePosts(posts)
// })

function getSlugFromPath(path) {
	return path.replace(/^.+\\(.+?)\\index.md$/i, '$1')
}

// Update posts cache when posts are changed, added, or removed.
const firstEncounters = new Set()

const ADD_POST = 'ADD_POST'
const REMOVE_POST = 'REMOVE_POST'
const CHANGE_POST = 'CHANGE_POST'
function reducer(state, action) {
	const now = new Date()
	const newUpdateTimes = {
		...state.updateTimes,
		[action.slug]: now.toTimeString().slice(0, 8),
	}

	switch (action.type) {
		case REMOVE_POST: {
			let newPosts = [...state.posts]
			const postIndex = newPosts.find((slug) => slug === action.slug)

			delete newUpdateTimes[action.slug]
			delete newPosts[postIndex]

			newPosts = organizePosts(newPosts)
			return {
				posts: newPosts,
				updateTimes: newUpdateTimes,
			}
		}

		case ADD_POST: {
			const newPosts = organizePosts([...state.posts, action.post])
			return {
				posts: newPosts,
				updateTimes: newUpdateTimes,
			}
		}

		case CHANGE_POST: {
			const postIndex = state.posts.findIndex(
				(post) => post.slug === action.slug,
			)
			let newPosts = [...state.posts]

			if (postIndex === -1) return state

			newPosts[postIndex] = action.post
			newPosts = organizePosts(newPosts)
			return {
				posts: newPosts,
				updateTimes: newUpdateTimes,
			}
		}

		default:
			return state
	}
}

function Compiler() {
	const [{posts, updateTimes}, dispatch] = useReducer(reducer, {
		posts: initialPosts,
		updateTimes: {},
	})

	useEffect(() => {
		savePosts(posts)
	}, [posts])

	useEffect(() => {
		const watcher = chokidar
			.watch('public/blog/*/index.md', {persistent: true})
			.on('change', async (path) => {
				const slug = getSlugFromPath(path)
				const rawPost = await getRawPost(slug)
				const post = await parse(slug, rawPost)
				dispatch({type: CHANGE_POST, post, slug})
			})
			.on('add', async (path) => {
				const slug = getSlugFromPath(path)

				// First ADD event is just realizing the file exists so we skip it
				if (!firstEncounters.has(slug)) return firstEncounters.add(slug)

				const rawPost = await getRawPost(slug)
				const post = await parse(slug, rawPost)
				dispatch({type: ADD_POST, post, slug})
			})
			.on('unlink', async (path) => {
				const slug = getSlugFromPath(path)
				dispatch({type: REMOVE_POST, slug})
			})

		return () => {
			watcher.close()
		}
	}, [dispatch])

	const updateTimeText = Object.keys(updateTimes).map(
		(slug) => html`
			<${Text} key=${slug}>
				${slug} — <${Text} color="green">${updateTimes[slug]}<//>
			<//>
		`,
	)

	return html`
		<${Box} flexDirection="column">
			<${Text} color="blue">Markdown Compiler<//>
			${updateTimeText.length ? updateTimeText : html`<${Text}>No updates yet...<//>`}
		</${Box}>
	`
}

const argv = minimist(process.argv.slice(2))

if (argv.w || argv.watch) {
	// Watch mode
	render(html`<${Compiler} />`)
} else {
	// Build mode
	getPosts()
		.then(savePosts)
		.then(() => {
			render(html`<${Text} color="green">Posts have been built!<//>`)
		})
}
