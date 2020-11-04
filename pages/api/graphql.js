import { ApolloServer, gql } from 'apollo-server-micro'
import { rawPosts, parse } from '../../utils/markdown'

const typeDefinitions = gql`
	type Frontmatter {
		title: String!
		description: String
		date: String!
		published: Boolean
	}

	type Post {
		id: ID!
		slug: String!
		html: String!
		frontmatter: Frontmatter!
	}

	type Query {
		posts: [Post]!
		post(slug: String!): Post
		test: String!
	}
`

const resolvers = {
	Query: {
		async posts() {
			const posts = await Promise.all(
				Object.keys(rawPosts).map((slug) =>
					resolvers.Query.post(null, { slug }),
				),
			)
			return posts.filter((post) => post !== null)
		},
		post(parent, { slug }, context) {
			return parse(slug)
		},
		test() {
			return 'Testing testing 123!'
		},
	},
}

const apolloServer = new ApolloServer({
	typeDefs: typeDefinitions,
	resolvers,
})

const handler = apolloServer.createHandler({ path: '/api/graphql' })

export default handler
export const config = { api: { bodyParser: false } }
