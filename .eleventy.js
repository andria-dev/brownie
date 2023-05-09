const path = require('path')

const sharpPlugin = require('eleventy-plugin-sharp')
const pluginTailwindCSS = require('eleventy-plugin-tailwindcss')

const automaticNoopener = require('eleventy-plugin-automatic-noopener')
const helmetPlugin = require('eleventy-plugin-helmet')

const timeToRead = require('eleventy-plugin-time-to-read')

const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const pluginTOC = require('@thedigitalman/eleventy-plugin-toc-a11y')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const {JSDOM} = require('jsdom')

const {promises: fs} = require('fs')

const sharpConfig = {
	urlPath: './',
	outputDir: '_site/public/',
}

/**
 * Adds a postfix to the file out name.
 * @param  {Object} options
 * @return {String}
 */
function createFileOutName({width, height, formatOut, ...options}) {
	const input = options.input.file
	const extname = formatOut === 'input' ? path.extname(input) : `.${formatOut}`
	const basename = path.basename(input, path.extname(input))

	let postfix = ''
	if (width > 0 && height > 0) {
		postfix = `-${width}x${height}`
	} else if (width > 0) {
		postfix = `-${width}`
	} else if (height > 0) {
		postfix = `-${height}h`
	}

	return basename + postfix + extname
}

module.exports = (
	/** @type {import('@11ty/eleventy/src/UserConfig.js')} */ eleventy,
) => {
	// Assets
	eleventy.addPlugin(pluginTailwindCSS, {src: './**/*.css'})
	eleventy.addPlugin(sharpPlugin(sharpConfig))
	eleventy.addAsyncShortcode(
		'_getUrl',
		async function (
			/** @type {{ fileOut: string; options: any; toFile: (arg0: any) => any; }} */ instance,
		) {
			if (!instance.fileOut) {
				instance.fileOut = path.join(
					sharpConfig.outputDir,
					sharpConfig.urlPath,
					createFileOutName(instance.options),
				)
			}
			console.log('Writing %o', instance.fileOut)
			await instance.toFile(instance.fileOut)

			const urlDirectory =
				sharpConfig.outputDir.replace('_site', '') + sharpConfig.urlPath
			return path.join(urlDirectory, path.basename(instance.fileOut))
		},
	)

	eleventy.addNunjucksShortcode(
		'replacePathBasename',
		function (/** @type {string} */ filepath, /** @type {string} */ filename) {
			// Directory
			if (filepath.endsWith('/')) return path.resolve(filepath, filename)
			return path.resolve(path.dirname(filepath), filename)
		},
	)

	// HTML
	eleventy.addPlugin(automaticNoopener)
	eleventy.addPlugin(helmetPlugin)

	// Blog post metadata
	eleventy.addPlugin(timeToRead, {
		style: 'short',
		append: ' read',
		speed: '250 words per minute',
	})

	// Markdown
	eleventy.addPlugin(syntaxHighlight, {preAttributes: {tabindex: 0}})
	eleventy.addPlugin(pluginTOC)
	eleventy.setLibrary(
		'md',
		markdownIt({
			html: true,
			linkify: true,
			typographer: true,
		}).use(markdownItAnchor),
	)

	// Eleventy config
	eleventy.addLayoutAlias('base', 'layouts/base.njk')
	eleventy.addLayoutAlias('post', 'layouts/post.njk')
	eleventy.addPassthroughCopy('public')
	eleventy.setTemplateFormats([
		'njk',
		'md',
		'png',
		'jpg',
		'jpeg',
		'webp',
		'svg',
		'avif',
		'mp4',
	])

	// Filters
	eleventy.addFilter('formatValidDateString', (/** @type {Date} */ value) =>
		// fr-CA gives YYYY-MM-DD format
		value.toLocaleDateString('fr-CA', {
			timeZone: 'UTC',
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		}),
	)
	eleventy.addFilter('formatHumanReadableDate', (/** @type {Date} */ value) =>
		value.toLocaleDateString('en-US', {
			timeZone: 'UTC',
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}),
	)

	// Collections
	eleventy.addCollection(
		'posts',
		(
			/** @type {import('@11ty/eleventy/src/TemplateCollection.js')} */ templateCollection,
		) => {
			const posts = templateCollection
				.getFilteredByTag('post')
				.filter(
					(item) =>
						process.env.NODE_ENV === 'development' || item.data.published,
				)
				.sort((a, b) => b.date.getTime() - a.date.getTime())

			for (let index = 0; index < posts.length; index++) {
				posts[index].data.previous = posts[index - 1] || null
				posts[index].data.next = posts[index + 1] || null
			}
			return posts
		},
	)

	return {
		dir: {
			input: 'pages',
			includes: '../_includes',
			data: '../_data',
		},
		templateFormats: ['njk', 'md'],
	}
}
