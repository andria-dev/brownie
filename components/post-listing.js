import {rhythm, scale} from '../utils/typography'
import Link from 'next/link'
import {PublicationInfo} from './publication-info'

export function PostListing({post: {slug, content, stats}}) {
	{
		if (!stats.published && process.env.NODE_ENV === 'production') {
			return null
		}

		return (
			<div className="post-listing">
				<h3 className="title">
					<Link href={slug}>{content.title}</Link>
				</h3>
				<small className="stats" style={scale(-1 / 5)}>
					<PublicationInfo
						date={stats.date}
						timeToRead={stats.timeToRead.text}
					/>
					{!stats.published ? (
						<span className="draft" style={scale(-1 / 5)}>
							<span aria-hidden="true">·</span> DRAFT
						</span>
					) : null}
				</small>
				<p>{content.description || 'An article by Chris Brown'}</p>

				<style jsx>{`
					.title {
						margin-bottom: ${rhythm(1 / 4)};
						font-weight: 700;
						transition: opacity 0.2s ease-out;
					}

					.title:hover {
						opacity: 0.8;
					}

					.title > :global(a) {
						box-shadow: none;
					}

					.stats {
						display: block;
						margin-left: ${rhythm(1 / 8)};
						margin-bottom: 0;
						opacity: 0.8;
					}

					.draft {
						margin-left: ${rhythm(1 / 8)};
						margin-bottom: 0;
						opacity: 0.8;
						font-weight: 600;
						font-family: sans-serif;
					}
				`}</style>
			</div>
		)
	}
}
