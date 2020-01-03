import React from 'react'

function InlineCode({ label, value, children = value }) {
  return (
    <code className="language-html" aria-label={label}>
      {children}
    </code>
  )
}

export default InlineCode
