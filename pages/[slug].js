import Layout from '../components/layout'
import {SEO} from '../components/seo'
import {rhythm, scale} from '../utils/typography'
import {PublicationInfo} from '../components/publication-info'
import Bio from '../components/bio'
import {rawPosts} from '../utils/markdown'
import {gql, client} from '../utils/graphql-client'

export default function BlogPost({post: {slug, content, stats, context}}) {
	return (
		<Layout title={content.title}>
			<SEO
				title={content.title}
				description={content.description || 'A post by Chris Brown'}
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

			<div dangerouslySetInnerHTML={{__html: content.html}} />

			<hr
				style={{
					marginBottom: rhythm(1),
				}}
			/>
			<Bio />

			{/*<ul*/}
			{/*		style={{*/}
			{/*			display: `flex`,*/}
			{/*			flexWrap: `wrap`,*/}
			{/*			justifyContent: `space-between`,*/}
			{/*			listStyle: `none`,*/}
			{/*			padding: 0,*/}
			{/*		}}*/}
			{/*>*/}
			{/*	<li>*/}
			{/*		{previous && (*/}
			{/*				<Link to={previous.fields.slug} rel="prev">*/}
			{/*					← {previous.frontmatter.title}*/}
			{/*				</Link>*/}
			{/*		)}*/}
			{/*	</li>*/}
			{/*	<li>*/}
			{/*		{next && (*/}
			{/*				<Link to={next.fields.slug} rel="next">*/}
			{/*					{next.frontmatter.title} →*/}
			{/*				</Link>*/}
			{/*		)}*/}
			{/*	</li>*/}
			{/*</ul>*/}
		</Layout>
	)
}

export async function getStaticPaths() {
	return {
		paths: Object.keys(rawPosts).map((slug) => ({
			params: {slug},
		})),
		fallback: false, // See the "fallback" section below
	}
}

export async function getStaticProps({params}) {
	const query = gql`
		query GetPost($slug: String!) {
			post(slug: $slug) {
				content {
					title
					description
					html
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

	const variables = {slug: params.slug}
	const {data} = await client.query({query, variables})

	return {props: data}
}
