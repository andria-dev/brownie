/**
 * SEO component that queries for data with data from Next.JS getStaticProps with GraphQL
 */

import React from 'react'
import Head from 'next/head'

export function SEO({siteMetadata, title, description}) {
	const metaDescription = description || siteMetadata.description

	return (
		<Head>
			<title>
				{title} | {siteMetadata.title}
			</title>
			<meta name="description" content={metaDescription} />
			<meta name="og:title" content={title} />
			<meta name="og:description" content={metaDescription} />
			<meta name="og:type" content="website" />
			<meta name="twitter:card" content="summary" />
			<meta name="twitter:creator" content={siteMetadata.author} />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={metaDescription} />
		</Head>
	)
}
