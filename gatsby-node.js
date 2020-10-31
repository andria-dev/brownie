const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
	const { createPage } = actions

	const blogPost = path.resolve(`./src/templates/blog-post/index.js`)
	return graphql(
		`
			{
				allMarkdownRemark(
					sort: { fields: [frontmatter___date], order: ASC }
					limit: 1000
				) {
					edges {
						node {
							fields {
								slug
							}
							frontmatter {
								title
								published
							}
						}
					}
				}
			}
		`,
	).then((result) => {
		if (result.errors) {
			throw result.errors
		}

		// Create blog posts pages.
		const posts = result.data.allMarkdownRemark.edges.map((post) => post.node)
		const ifPublished = (post) => post.frontmatter.published

		posts.forEach((post, index) => {
			const previous =
				index === 0
					? null
					: posts.slice(0, index).slice().reverse().find(ifPublished)
			const next =
				index === posts.length - 1
					? null
					: posts.slice(index + 1).find(ifPublished)

			createPage({
				path: post.fields.slug,
				component: blogPost,
				context: {
					slug: post.fields.slug,
					previous,
					next,
				},
			})
		})

		return null
	})
}

exports.onCreateNode = ({ node, actions, getNode }) => {
	const { createNodeField } = actions

	if (node.internal.type === `MarkdownRemark`) {
		const value = createFilePath({ node, getNode })
		createNodeField({
			name: `slug`,
			node,
			value,
		})
	}
}
