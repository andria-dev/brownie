import React, {useState} from 'react'
import Image from 'next/image'

import {rhythm} from '../utils/typography'
import siteInfo from '../content/site-info.json'
const avatar = '/assets/profile-pic'

export function Bio(props) {
	const {author, social} = siteInfo

	const [avatarSrc, setAvatarSrc] = useState(`${avatar}.avif`)
	function nextFallback() {
		if (avatarSrc.endsWith('.avif')) setAvatarSrc(`${avatar}.webp`)
		else if (avatarSrc.endsWith('.webp')) setAvatarSrc(`${avatar}.jpg`)
	}

	return (
		<div className="Bio" {...props}>
			<Image
				className="portrait"
				src={avatarSrc}
				alt={author}
				onError={nextFallback}
				width={75}
				height={75}
				layout="fixed"
			/>
			<p style={{margin: `auto 0 auto ${rhythm(1 / 2)}`}}>
				Written by <b>{author}</b>, from the Boise area. Building useful things
				for the OSS community. Follow her work on{' '}
				<a href={`https://twitter.com/${social.twitter}`}>
					<span aria-hidden="true">🐦</span> Twitter
				</a>{' '}
				or{' '}
				<a href={`https://github.com/${social.github}`}>
					<span aria-hidden="true">👩‍💻</span> GitHub.
				</a>
			</p>

			<style jsx>{`
				.Bio {
					display: flex;
					align-items: center;
				}

				.Bio > :global(div:first-child) {
					flex-shrink: 0;
				}

				/* Global because next/image is not in this component */
				:global(.portrait) {
					width: 75px;
					min-width: 75px !important; /* keeps it from going below 75px */
					height: 75px;
					margin-bottom: 0;
					border-radius: 50%;
				}
			`}</style>
		</div>
	)
}
