import unified from 'unified'
import remark from 'remark-parse'
import stringify from 'remark-stringify'

import frontmatter from 'remark-frontmatter'
import {parse as yaml} from 'yaml'

import extractFrontmatter from 'remark-extract-frontmatter'
import filter from 'unist-util-filter'

import prism from 'remark-prism'
import html from 'remark-html'
import readingTime from 'reading-time'

import {readdir, readFile} from 'fs/promises'
import {join} from 'path'
import {cwd} from 'process'

async function getRawPosts() {
	const slugs = (
		await readdir(join(cwd(), './content/blog'), {withFileTypes: true})
	)
		.filter((entity) => entity.isDirectory())
		.map((entity) => entity.name)

	const rawPosts = {}
	for (const slug of slugs) {
		rawPosts[slug] = await readFile(
			join(cwd(), './content/blog', slug, 'index.md'),
			{encoding: 'utf8'},
		)
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
		.use(stringify)
		.use(frontmatter)
		.use(extractFrontmatter, {yaml})
		.use(function removeFrontmatter() {
			return (tree) => filter(tree, (node) => node.type !== 'yaml')
		})
		.use(prism)
		.use(html)
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

export const postsPromise = getRawPosts()
	.then(parsePosts)
	.then(sortPosts)
	.then(addPageContext)
