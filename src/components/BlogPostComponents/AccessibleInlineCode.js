import React from 'react'

function AccessibleInlineCode({ label, value, children=value }) {
  console.log(children)
  return (
    <code className="language-html" aria-label={label}>
      {children}
    </code>
  )
}

export default AccessibleInlineCode
