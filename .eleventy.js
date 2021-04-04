const sharpPlugin = require('eleventy-plugin-sharp')
const pluginTailwindCSS = require('eleventy-plugin-tailwindcss')

const automaticNoopener = require('eleventy-plugin-automatic-noopener')
const helmetPlugin = require('eleventy-plugin-helmet')

const timeToRead = require('eleventy-plugin-time-to-read')

const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const pluginTOC = require('eleventy-plugin-nesting-toc')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')

module.exports = (eleventyConfig) => {
	// TODO: set up and use sharpPlugin
	eleventyConfig.addPlugin(pluginTailwindCSS)

	// DOM related
	eleventyConfig.addPlugin(automaticNoopener)
	eleventyConfig.addPlugin(helmetPlugin)

	// Blog post related
	eleventyConfig.addPlugin(timeToRead)

	// Markdown related
	eleventyConfig.addPlugin(pluginTOC)
	eleventyConfig.setLibrary(
		'md',
		markdownIt({
			html: true,
			linkify: true,
			typographer: true,
		}).use(markdownItAnchor, {}),
	)
	eleventyConfig.addPlugin(syntaxHighlight)
}
