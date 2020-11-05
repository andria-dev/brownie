import React from 'react'

import Bio from '../components/bio'
import Layout from '../components/layout'
import {SEO} from '../components/seo'
import {PublicationInfo} from '../components/publicationInfo'

import {rhythm, scale} from '../utils/typography'

export default function HomePage({posts}) {
	return (
		<Layout>
			<SEO title="All posts" />
			<Bio />
			{posts.map(({node}) => {
				if (
					!node.frontmatter.published &&
					process.env.NODE_ENV === 'production'
				) {
					return null
				}

				const title = node.frontmatter.title || node.fields.slug
				return (
					<div key={node.fields.slug}>
						<h3
							style={{
								marginBottom: rhythm(1 / 4),
							}}
						>
							<Link style={{boxShadow: `none`}} to={node.fields.slug}>
								{title}
							</Link>
						</h3>
						<small
							style={{
								...scale(-1 / 5),
								display: `block`,
								marginLeft: rhythm(1 / 8),
								marginBottom: 0,
								opacity: 0.8,
							}}
						>
							<PublicationInfo
								date={node.frontmatter.date}
								formattedDate={node.frontmatter.formattedDate}
								timeToRead={node.timeToRead}
							/>
							{!node.frontmatter.published ? (
								<span
									style={{
										...scale(-1 / 5),
										marginLeft: rhythm(1 / 8),
										marginBottom: 0,
										opacity: 0.8,
										fontWeight: 600,
										fontFamily: 'sans-serif',
									}}
								>
									<span aria-hidden="true">·</span> DRAFT
								</span>
							) : null}
						</small>
						<p
							dangerouslySetInnerHTML={{
								__html: node.frontmatter.description || node.excerpt,
							}}
						/>
					</div>
				)
			})}
		</Layout>
	)
}

export async function getStaticProps(context) {
	const query = gql`
		query GetPostListings {
			posts {
				slug
				content {
					title
					description
				}
				stats {
					date
					published
					timeToRead {
						text
					}
				}
			}
		}
	`
	const {
		data: {posts},
	} = await client.query({query})
	return {props: {posts}}
}
