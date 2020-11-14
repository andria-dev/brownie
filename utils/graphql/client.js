import {ApolloClient, InMemoryCache} from '@apollo/client'
export {gql} from '@apollo/client'
import {SchemaLink} from 'apollo-link-schema'
import {resolvers, typeDefinitions as typeDefs} from '../../pages/api/graphql'
import {makeExecutableSchema} from 'graphql-tools'

const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
})

export const client = new ApolloClient({
	ssrMode: true,
	cache: new InMemoryCache(),
	link: new SchemaLink({schema}),
	defaultOptions: {
		query: {fetchPolicy: 'no-cache'},
		watchQuery: {fetchPolicy: 'no-cache'},
	},
})
