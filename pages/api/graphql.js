import {ApolloServer, gql} from 'apollo-server-micro'
import {rawPosts, parse} from '../../utils/markdown'
import {GraphQLScalarType} from 'graphql'

const typeDefinitions = gql`
	scalar Date

	type Post {
		id: ID!
		slug: String!
		content: PostContent!
		stats: PostStatistics!
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

	type Query {
		posts: [Post]!
		post(slug: String!): Post
	}
`

const resolvers = {
	Query: {
		async posts() {
			const posts = await Promise.all(
				Object.keys(rawPosts).map((slug) => resolvers.Query.post(null, {slug})),
			)
			return posts
				.filter((post) => post !== null)
				.sort((postA, postB) => {
					// descending order (newest first)
					return new Date(postB.stats.date) - new Date(postA.stats.date)
				})
		},
		post(parent, {slug}) {
			return parse(slug)
		},
	},
	Date: new GraphQLScalarType({
		name: 'Date',
		description: 'Takes in 2020-11-04 and outputs Date object',
		serialize(value) {
			// Move one day forward since toLocaleDateString is not UTC
			const nextDay = new Date(value).getTime() + 24 * 60 * 60 * 1000
			return new Date(nextDay).toLocaleDateString(undefined, {
				month: 'long',
				day: 'numeric',
				year: 'numeric',
			})
		},
	}),
}

const apolloServer = new ApolloServer({
	typeDefs: typeDefinitions,
	resolvers,
})

const handler = apolloServer.createHandler({path: '/api/graphql'})

export default handler
export const config = {api: {bodyParser: false}}
