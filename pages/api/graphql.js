import {ApolloServer, gql} from 'apollo-server-micro'
import {GraphQLScalarType} from 'graphql'
import posts from '../../posts-cache.json'

export const typeDefinitions = gql`
	scalar Date

	type Post {
		id: ID!
		slug: String!
		content: PostContent!
		stats: PostStatistics!
		context: PageContext!
	}

	type PostContent {
		title: String!
		description: String
		html: String!
	}

	type PostStatistics {
		date: Date!
		published: Boolean
		timeToRead: ReadingTime!
	}

	type ReadingTime {
		text: String!
		minutes: Int!
		time: Int!
		words: Int!
	}

	type PageContext {
		previous: Post
		next: Post
	}

	type SiteMetadata {
		title: String
		author: String
		description: String
		siteURL: String
		social: Social
	}

	type Social {
		twitter: String
		github: String
	}

	type Query {
		posts: [Post]!
		post(slug: String!): Post
		siteMetadata: SiteMetadata
	}
`

export const resolvers = {
	Query: {
		posts() {
			return posts
		},
		async post(parent, {slug}) {
			return posts.find((post) => post.slug === slug)
		},
		siteMetadata() {
			return {
				title: "Andria's Page",
				author: 'Andria Brown',
				description: 'A blog about front-end web development and my life.',
				siteURL: 'https://andria.page',
				social: {
					twitter: 'andria_dev',
					linkedin: 'andria_dev',
					github: 'andria-dev',
				},
			}
		},
	},
	Date: new GraphQLScalarType({
		name: 'Date',
		description: 'Takes in 2020-11-05 and November 5, 2020',
		serialize(value) {
			return new Date(value).toLocaleDateString('en-US', {
				timeZone: 'UTC',
				month: 'long',
				day: 'numeric',
				year: 'numeric',
			})
		},
	}),
}

const apolloServer = new ApolloServer({
	uploads: false,
	typeDefs: typeDefinitions,
	resolvers,
})

const handler = apolloServer.createHandler({path: '/api/graphql'})

export default handler
export const config = {api: {bodyParser: false}}
