import rehypeReact from 'rehype-react'
import { createElement } from 'react'
import AccessibleInlineCode from './AccessibleInlineCode'

export const renderAST = new rehypeReact({
  createElement: createElement,
  components: {
    code: AccessibleInlineCode
  }
}).Compiler
