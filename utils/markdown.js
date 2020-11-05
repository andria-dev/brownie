import unified from 'unified'
import remark from 'remark-parse'
import stringify from 'remark-stringify'

import frontmatter from 'remark-frontmatter'
import {parse as yaml} from 'yaml'

import extractFrontmatter from 'remark-extract-frontmatter'
import filter from 'unist-util-filter'

import html from 'remark-html'
import readingTime from 'reading-time'

import {readdirSync, readFileSync} from 'fs'
import {join} from 'path'
import {cwd} from 'process'

export const rawPosts = {}
const slugs = readdirSync(join(cwd(), './content/blog'), {
	withFileTypes: true,
})
	.filter((entity) => entity.isDirectory())
	.map((entity) => entity.name)

for (const slug of slugs) {
	rawPosts[slug] = readFileSync(
		join(cwd(), './content/blog', slug, 'index.md'),
	).toString()
}

function removeFrontmatter() {
	return (tree) => filter(tree, (node) => node.type !== 'yaml')
}

export function parse(slug) {
	if (!(slug in rawPosts)) return null

	return unified()
		.use(remark)
		.use(stringify)
		.use(frontmatter)
		.use(extractFrontmatter, {yaml})
		.use(removeFrontmatter)
		.use(html)
		.process(rawPosts[slug])
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
				timeToRead: readingTime(rawPosts[slug]),
			},
		}))
		.catch((error) => {
			console.error(error)
			return null
		})
}
