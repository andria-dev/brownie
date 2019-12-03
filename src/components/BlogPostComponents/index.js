import rehypeReact from 'rehype-react'
import { createElement } from 'react'
import AccessibleInlineCode from './AccessibleInlineCode'
import ListItemParagraph from './ListItemParagraph'

export const renderAST = new rehypeReact({
  createElement: createElement,
  components: {
    code: AccessibleInlineCode,
    li: ListItemParagraph
  }
}).Compiler
