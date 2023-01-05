import {rhythm, scale} from '../utils/typography'
import Link from 'next/link'
import {PublicationInfo} from './publication-info'

export function PostListing({post: {slug, content, stats}}) {
	return (
		<div className="post-listing">
			<h2 className="title">
				<Link href={slug} legacyBehavior>
					<a>{content.title}</a>
				</Link>
			</h2>
			<small className="stats" style={scale(-1 / 5)}>
				<PublicationInfo date={stats.date} timeToRead={stats.timeToRead.text} />
				{!stats.published ? (
					<span className="draft" style={scale(-1 / 5)}>
						<span aria-hidden="true">·</span> DRAFT
					</span>
				) : null}
			</small>
			<p>{content.description || 'An article by Andria Brown'}</p>

			<style jsx>{`
				.title {
					margin-bottom: ${rhythm(1 / 4)};
					font-weight: 700;
					transition: opacity 0.2s ease-out;
					text-rendering: optimizeLegibility;
					font-size: 1.4427rem;
					line-height: 1.1;
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
