/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, {useState} from 'react'
import {useStaticQuery, graphql} from 'gatsby'
import Image from 'gatsby-image'

import {rhythm} from '../utils/typography'

const Bio = () => {
	const data = useStaticQuery(graphql`
		query BioAndAvatarQuery {
			avatarAVIF: file(absolutePath: {regex: "/profile-pic.avif/"}) {
				publicURL
			}
			avatarWEBP: file(absolutePath: {regex: "/profile-pic.webp/"}) {
				publicURL
			}
			avatarJPG: file(absolutePath: {regex: "/profile-pic.jpg/"}) {
				publicURL
			}

			site {
				siteMetadata {
					author
					social {
						twitter
						github
					}
				}
			}
		}
	`)

	const {author, social} = data.site.siteMetadata
	const {avatarAVIF, avatarWEBP, avatarJPG} = data
	const [src, setSrc] = useState(avatarAVIF)

	function nextFallback() {
		if (src === avatarAVIF) setSrc(avatarWEBP)
		else if (src === avatarWEBP) setSrc(avatarJPG)
	}

	return (
		<div
			style={{
				display: `flex`,
				marginBottom: rhythm(2.5),
				justifyContent: 'center',
			}}
		>
			<Image
				onError={nextFallback}
				fixed={{
					src: src.publicURL,
					width: 75,
					height: 75,
				}}
				alt={author}
				style={{
					marginTop: rhythm(1 / 4),
					marginRight: rhythm(1 / 2),
					marginBottom: 0,
					minWidth: 75,
				}}
				className="portrait"
			/>
			<p style={{margin: 'auto 0'}}>
				Written by <b>{author}</b>, from the Boise area. Building useful things
				for the OSS community.
				{` `}
				Follow her work on{' '}
				<a href={`https://twitter.com/${social.twitter}`}>
					<span aria-hidden="true">🐦</span> Twitter
				</a>{' '}
				or{' '}
				<a href={`https://github.com/${social.github}`}>
					<span aria-hidden="true">👩‍💻</span> GitHub.
				</a>
			</p>
		</div>
	)
}

export default Bio
