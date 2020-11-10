import Link from 'next/link'
import {useRouter} from 'next/router'

import {rhythm, scale} from '../utils/typography'

export default function Layout({siteMetadata, children}) {
	const router = useRouter()
	let header

	if (router.pathname === '/') {
		header = (
			<h1
				style={{
					...scale(1.5),
					marginBottom: rhythm(1.5),
					marginTop: 0,
				}}
				className="blog-title blog-title--inactive"
			>
				<Link
					style={{
						boxShadow: 'none',
						textDecoration: 'none',
						fontFamily: 'Montserrat',
						fontWeight: 900,
					}}
					href="/"
					aria-label="The Brownie Blog"
				>
					<a>
						<span>The&#32;</span>
						<span style={{whiteSpace: 'nowrap'}}>
							Br
							<img
								src="/assets/logo.svg"
								alt=""
								style={{
									marginBottom: 'auto',
									transform: 'translateY(0.25rem)',
								}}
							/>
							wnie
						</span>
						<span>&#32;Blog</span>
					</a>
				</Link>
			</h1>
		)
	} else {
		header = (
			<h3 className="blog-title">
				<Link href="/">
					<a>{siteMetadata.title}</a>
				</Link>
			</h3>
		)
	}

	return (
		<div className="app-wrapper">
			<header>{header}</header>
			<main>{children}</main>
			<footer style={{marginTop: 40}}>
				© {new Date().getFullYear()} Chris Brown, Built with{' '}
				<a href="https://nextjs.org" rel="nofollow">
					<i>Next.JS</i>
				</a>{' '}
				and{' '}
				<a href="https://www.apollographql.com" rel="nofollow">
					<i>Apollo</i>
				</a>
				.
			</footer>
			<style jsx global>{`
				.blog-title a {
					color: #333;
					box-shadow: none;
					overflow: hidden;
				}

				.blog-title--inactive a {
					background-clip: text;
					background-position-x: 147px !important;
					background: linear-gradient(to right, #668afe, #668afe 50%, #333 50%);

					transition: background-position 300ms ease;
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
				}

				.blog-title a:hover {
					background-position-x: 500px !important;
				}

				.app-wrapper {
					margin-left: auto;
					margin-right: auto;
					max-width: ${rhythm(24)};
					padding: ${rhythm(1.5)} ${rhythm(3 / 4)} ${rhythm(4)};
				}
			`}</style>
		</div>
	)
}
