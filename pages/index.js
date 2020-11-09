import {client, gql} from '../utils/graphql-client'

import {Bio} from '../components/bio'
import Layout from '../components/layout'
import {SEO} from '../components/seo'
import {PostListing} from '../components/post-listing'
import {rhythm} from '../utils/typography'

export default function HomePage({posts, siteMetadata}) {
	return (
		<Layout siteMetadata={siteMetadata}>
			<SEO title="All posts" siteMetadata={siteMetadata} />
			<Bio style={{marginBottom: rhythm(2.5)}} siteMetadata={siteMetadata} />
			{posts.map((post) => (
				<PostListing post={post} key={post.slug} />
			))}
		</Layout>
	)
}

export async function getStaticProps() {
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
			siteMetadata {
				...Metadata
			}
		}
	`
	const {data} = await client.query({query})
	return {props: data}
}
