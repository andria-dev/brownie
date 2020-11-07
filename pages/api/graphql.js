import {ApolloServer, gql} from 'apollo-server-micro'
import {postsPromise} from '../../utils/markdown'
import {GraphQLScalarType} from 'graphql'

const typeDefinitions = gql`
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

	type Query {
		posts: [Post]!
		post(slug: String!): Post
	}
`

const resolvers = {
	Query: {
		posts() {
			return postsPromise
		},
		async post(parent, {slug}) {
			return (await postsPromise).find((post) => post.slug === slug)
		},
	},
	Date: new GraphQLScalarType({
		name: 'Date',
		description: 'Takes in 2020-11-04 and November 4, 2020',
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
