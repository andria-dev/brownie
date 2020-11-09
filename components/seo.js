/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react'
import Head from 'next/head'

import siteInfo from '../public/site-info.json'

export function SEO({title, description}) {
	const metaDescription = description || siteInfo.description

	return (
		<Head>
			<title>
				{title} | {siteInfo.title}
			</title>
			<meta name="description" content={metaDescription} />
			<meta name="og:title" content={title} />
			<meta name="og:description" content={metaDescription} />
			<meta name="og:type" content="website" />
			<meta name="twitter:card" content="summary" />
			<meta name="twitter:creator" content={siteInfo.author} />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={metaDescription} />
		</Head>
	)
}
