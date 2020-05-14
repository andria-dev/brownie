/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'

import { rhythm } from '../utils/typography'

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fixed(width: 75, height: 75) {
            ...GatsbyImageSharpFixed
          }
        }
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

  const { author, social } = data.site.siteMetadata
  return (
    <div
      style={{
        display: `flex`,
        marginBottom: rhythm(2.5),
      }}
    >
      <Image
        fixed={data.avatar.childImageSharp.fixed}
        alt={author}
        style={{
          marginTop: rhythm(1 / 4),
          marginRight: rhythm(1 / 2),
          marginBottom: 0,
          minWidth: 50,
        }}
        className="portrait"
      />
      <p>
        Written by <b>{author}</b>, from the Boise area. Building useful things
        for the OSS community.
        {` `}
        Follow his work on{' '}
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
