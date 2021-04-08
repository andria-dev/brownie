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
	eleventy.addPlugin(sharpPlugin(sharpConfig))
	eleventy.addAsyncShortcode('_getUrl', async function (instance) {
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
	})
	// TODO: eleventy.addPlugin(pluginTailwindCSS)

	// HTML
	eleventy.addPlugin(automaticNoopener)
	eleventy.addPlugin(helmetPlugin)

	// Blog post metadata
	eleventy.addPlugin(timeToRead, {speed: '250 words per minute'})

	// Markdown
	eleventy.addPlugin(syntaxHighlight)
	eleventy.addPlugin(pluginTOC)
	eleventy.setLibrary(
		'md',
		markdownIt({
			html: true,
			linkify: true,
			typographer: true,
		}).use(markdownItAnchor, {}),
	)

	// Eleventy config
	eleventy.addLayoutAlias('base', 'layouts/base.njk')
	eleventy.addLayoutAlias('post', 'layouts/post.njk')
	eleventy.addPassthroughCopy('public')

	// Filters
	eleventy.addFilter('formatValidDateString', (value) =>
		// fr-CA gives YYYY-MM-DD format
		new Date(value).toLocaleDateString('fr-CA', {
			timeZone: 'UTC',
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		}),
	)
	eleventy.addFilter('formatHumanReadableDate', (value) =>
		new Date(value).toLocaleDateString('en-US', {
			timeZone: 'UTC',
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}),
	)

	// Collections
	eleventy.addCollection('posts', (
		/** @type {import('@11ty/eleventy/src/TemplateCollection.js')} */ templateCollection,
	) => {
		return templateCollection
			.getFilteredByTag('post')
			.filter(
				(item) => process.env.NODE_ENV === 'development' || item.data.published,
			)
			.sort((a, b) => b.date.getTime() - a.date.getTime())
	})

	return {
		input: '.',
		templateFormats: ['njk', 'md'],
	}
}
