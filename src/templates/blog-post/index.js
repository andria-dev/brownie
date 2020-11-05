import React from 'react'
import {graphql, Link} from 'gatsby'

import Bio from '../../components/bio'
import Layout from '../../components/layout'
import SEO from '../../components/seo'
import PublicationInfo from '../../components/publicationInfo'

import {rhythm, scale} from '../../utils/typography'
import 'prism-themes/themes/prism-base16-ateliersulphurpool.light.css'
import './styles.css'

export default function BlogPostTemplate(props) {
	const post = props.data.markdownRemark
	const siteTitle = props.data.site.siteMetadata.title
	const {previous, next} = props.pageContext

	return (
		<Layout location={props.location} title={siteTitle}>
			<SEO
				title={post.frontmatter.title}
				description={post.frontmatter.description || post.excerpt}
			/>
			{!post.frontmatter.published ? (
				<p
					style={{
						...scale(-1 / 5),
						marginLeft: rhythm(1 / 8),
						marginTop: rhythm(1),
						marginBottom: 0,
						opacity: 0.8,
						fontWeight: 'bold',
						fontFamily: 'sans-serif',
					}}
				>
					DRAFT
				</p>
			) : null}
			<h1
				style={{
					marginTop: post.frontmatter.published ? rhythm(1) : 0,
					marginBottom: 0,
				}}
			>
				{post.frontmatter.title}
			</h1>
			<p
				style={{
					...scale(-1 / 5),
					display: `block`,
					marginLeft: rhythm(1 / 8),
					marginBottom: rhythm(1),
					opacity: 0.8,
				}}
			>
				<PublicationInfo
					date={post.frontmatter.date}
					formattedDate={post.frontmatter.formattedDate}
					timeToRead={post.timeToRead}
				/>
			</p>

			<div dangerouslySetInnerHTML={{__html: post.html}} />

			<hr
				style={{
					marginBottom: rhythm(1),
				}}
			/>
			<Bio />

			<ul
				style={{
					display: `flex`,
					flexWrap: `wrap`,
					justifyContent: `space-between`,
					listStyle: `none`,
					padding: 0,
				}}
			>
				<li>
					{previous && (
						<Link to={previous.fields.slug} rel="prev">
							← {previous.frontmatter.title}
						</Link>
					)}
				</li>
				<li>
					{next && (
						<Link to={next.fields.slug} rel="next">
							{next.frontmatter.title} →
						</Link>
					)}
				</li>
			</ul>
		</Layout>
	)
}

export const pageQuery = graphql`
	query BlogPostBySlug($slug: String!) {
		site {
			siteMetadata {
				title
				author
			}
		}
		markdownRemark(fields: {slug: {eq: $slug}}) {
			id
			excerpt(pruneLength: 160)
			html
			timeToRead
			frontmatter {
				title
				date
				formattedDate: date(formatString: "MMMM D, YYYY")
				description
				published
			}
		}
	}
`
