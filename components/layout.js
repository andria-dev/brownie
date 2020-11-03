import Link from 'next/link'
import { useRouter } from 'next/router'

import { rhythm, scale } from '../utils/typography'
import siteInfo from '../content/site-info.json'

export default function Layout({ children }) {
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
			>
				<Link
					style={{
						boxShadow: 'none',
						textDecoration: 'none',
						color: 'inherit',
						fontFamily: 'Montserrat',
						fontWeight: 900,
					}}
					href="/"
					aria-label="The Brownie Blog"
				>
					<>
						<span>The&#32;</span>
						<span style={{ whiteSpace: 'nowrap' }}>
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
					</>
				</Link>
			</h1>
		)
	} else {
		header = (
			<h3>
				<Link
					style={{
						boxShadow: 'none',
						textDecoration: 'none',
						color: 'inherit',
					}}
					href="/"
				>
					{siteInfo.title}
				</Link>
			</h3>
		)
	}

	return (
		<div
			style={{
				marginLeft: 'auto',
				marginRight: 'auto',
				maxWidth: rhythm(24),
				padding: `${rhythm(1.5)} ${rhythm(3 / 4)} ${rhythm(4)}`,
			}}
		>
			<header>{header}</header>
			<main>{children}</main>
			<footer>
				© {new Date().getFullYear()}, Built with{' '}
				<a href="https://www.gatsbyjs.org">Gatsby</a>
			</footer>
		</div>
	)
}
