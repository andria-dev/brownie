import React from 'react'
import { Link, graphql } from 'gatsby'

import Bio from '../components/bio'
import Layout from '../components/layout'
import SEO from '../components/seo'
import { rhythm, scale } from '../utils/typography'

import 'prism-themes/themes/prism-base16-ateliersulphurpool.light.css'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        {!post.frontmatter.published ? (
          <p
            style={{
              ...scale(-1 / 5),
              marginLeft: rhythm(1 / 8),
              marginTop: rhythm(1),
              marginBottom: 0,
              opacity: 0.8,
              fontWeight: 'bold',
              fontFamily: 'Verdana'
            }}
          >
            DRAFT
          </p>
        ) : null}
        <h1
          style={{
            marginTop: post.frontmatter.published ? rhythm(1) : 0,
            marginBottom: 0
          }}
        >
          {post.frontmatter.title}
        </h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: `block`,
            marginLeft: rhythm(1 / 8),
            marginBottom: rhythm(1),
            opacity: 0.8
          }}
        >
          <time dateTime={post.frontmatter.date}>
            {post.frontmatter.formattedDate}
          </time>{' '}
          · {post.timeToRead} min read
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr
          style={{
            marginBottom: rhythm(1)
          }}
        />
        <Bio />

        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      timeToRead
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
        formattedDate: date(formatString: "MMMM D, YYYY")
        description
        published
      }
    }
  }
`
