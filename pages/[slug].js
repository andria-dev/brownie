import Link from 'next/link'

import {Bio} from '../components/bio'
import {SEO} from '../components/seo'
import Layout from '../components/layout'
import {PublicationInfo} from '../components/publication-info'

import {gql, client} from '../utils/graphql/client'
import {rhythm, scale} from '../utils/typography'

import 'prism-themes/themes/prism-base16-ateliersulphurpool.light.css'
import {GET_POST} from '../utils/graphql/queries'

export default function BlogPost({
	post: {content, stats, context},
	siteMetadata,
}) {
	return (
		<Layout title={content.title} siteMetadata={siteMetadata}>
			<SEO
				title={content.title}
				description={content.description || 'A post by Chris Brown'}
				siteMetadata={siteMetadata}
			/>
			{!stats.published ? (
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
					marginTop: stats.published ? rhythm(1) : 0,
					marginBottom: 0,
				}}
			>
				{content.title}
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
				<PublicationInfo date={stats.date} timeToRead={stats.timeToRead.text} />
			</p>

			<article
				className="article-content"
				dangerouslySetInnerHTML={{__html: content.html}}
			/>
			<hr style={{margin: `${rhythm(2)} 0`}} />

			<Bio
				style={{marginBottom: rhythm(1)}}
				siteMetadata={siteMetadata}
				priority={false}
			/>
			<ul className="page-links">
				<li className="previous-link">
					{context.previous && (
						<Link href={context.previous.slug} rel="prev">
							<a>← {context.previous.content.title}</a>
						</Link>
					)}
				</li>
				<li className="next-link">
					{context.next && (
						<Link href={'/' + context.next.slug} rel="next">
							<a>{context.next.content.title} →</a>
						</Link>
					)}
				</li>
			</ul>

			<style jsx>{`
				ul ul {
					margin-left: 2rem;
					margin-top: 0.25rem;
				}

				li p {
					margin-bottom: 0;
				}

				.page-links {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;
					list-style: none;
					padding: 0;
				}

				.next-link {
					margin-left: auto;
				}

				.article-content :global(img) {
					display: block;
					max-width: 200px;
					width: 100%;
					margin: 0 auto;
				}

				.article-content :global(img.large) {
					max-width: 590px;
				}
			`}</style>
		</Layout>
	)
}

export async function getStaticPaths() {
	const query = gql`
		query GetSlugs {
			posts {
				slug
			}
		}
	`
	const {data} = await client.query({query})
	return {
		paths: data.posts.map((post) => ({
			params: {slug: post.slug},
		})),
		fallback: false,
	}
}

export async function getStaticProps({params}) {
	const query = GET_POST

	const variables = {slug: params.slug}
	const {data} = await client.query({query, variables})

	return {props: data}
}

export const options = {
	unstable_runtimeJS: false,
}
