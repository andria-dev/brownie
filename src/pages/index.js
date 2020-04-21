import React from 'react'
import { Link, graphql } from 'gatsby'

import Bio from '../components/bio'
import Layout from '../components/layout'
import SEO from '../components/seo'
import PublicationInfo from '../components/publicationInfo'
import { rhythm, scale } from '../utils/typography'

import logo from '../../content/assets/logo.svg'

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle} logo={logo}>
        <SEO title="All posts" />
        <Bio />
        {posts.map(({ node }) => {
          if (
            !node.frontmatter.published &&
            process.env.NODE_ENV === 'production'
          ) {
            return null
          }

          const title = node.frontmatter.title || node.fields.slug
          return (
            <div key={node.fields.slug}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  {title}
                </Link>
              </h3>
              <small
                style={{
                  ...scale(-1 / 5),
                  display: `block`,
                  marginLeft: rhythm(1 / 8),
                  marginBottom: 0,
                  opacity: 0.8,
                }}
              >
                <PublicationInfo
                  date={node.frontmatter.date}
                  formattedDate={node.frontmatter.formattedDate}
                  timeToRead={node.timeToRead}
                />
                {!node.frontmatter.published ? (
                  <span
                    style={{
                      ...scale(-1 / 5),
                      marginLeft: rhythm(1 / 8),
                      marginBottom: 0,
                      opacity: 0.8,
                      fontWeight: 600,
                      fontFamily: 'sans-serif',
                    }}
                  >
                    <span aria-hidden="true">·</span> DRAFT
                  </span>
                ) : null}
              </small>
              <p
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.description || node.excerpt,
                }}
              />
            </div>
          )
        })}
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          timeToRead
          frontmatter {
            date
            formattedDate: date(formatString: "MMMM DD, YYYY")
            title
            description
            published
          }
        }
      }
    }
  }
`
