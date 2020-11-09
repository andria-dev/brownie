import {ApolloServer, gql} from 'apollo-server-micro'
import {addPageContext, getPosts} from '../../utils/markdown'
import {GraphQLScalarType} from 'graphql'

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

	fragment Metadata on SiteMetadata {
		title
		author
		description
		siteURL
		social {
			twitter
			github
		}
	}

	type Query {
		posts: [Post]!
		post(slug: String!): Post
		siteMetadata: SiteMetadata
	}
`

const getFilteredPosts = () => {
	if (process.env.NODE_ENV === 'production') {
		return getPosts()
			.then((posts) => posts.filter((post) => post.stats.published))
			.then(addPageContext)
	} else {
		return getPosts().then(addPageContext)
	}
}
export const resolvers = {
	Query: {
		posts() {
			return getFilteredPosts()
		},
		async post(parent, {slug}) {
			const posts = await getFilteredPosts()
			return posts.find((post) => post.slug === slug)
		},
		siteMetadata() {
			return {
				title: 'The Brownie Blog',
				author: 'Chris Brown',
				description: 'A blog about front-end web development and my life.',
				siteURL: 'https://chrisbrownie.dev',
				social: {
					twitter: 'ChrisHBrown55',
					github: 'ChrisBrownie55',
				},
			}
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
	uploads: false,
	typeDefs: typeDefinitions,
	resolvers,
})

const handler = apolloServer.createHandler({path: '/api/graphql'})

export default handler
export const config = {api: {bodyParser: false}}
