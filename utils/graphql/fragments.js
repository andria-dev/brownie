import {gql} from './client'

export const METADATA = gql`
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
`
