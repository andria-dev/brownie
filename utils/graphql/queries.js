import {gql} from './client'
import {METADATA} from './fragments'

export const GET_POST_LISTINGS = gql`
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
	${METADATA}
`

export const GET_POST = gql`
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
			context {
				previous {
					slug
					content {
						title
					}
				}
				next {
					slug
					content {
						title
					}
				}
			}
		}

		siteMetadata {
			...Metadata
		}
	}
	${METADATA}
`
