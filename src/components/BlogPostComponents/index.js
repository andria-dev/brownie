import rehypeReact from 'rehype-react'
import { createElement } from 'react'
import InlineCode from './InlineCode'
import ListItemParagraph from './ListItemParagraph'

export const renderAST = new rehypeReact({
  createElement: createElement,
  components: {
    code: InlineCode,
    li: ListItemParagraph
  }
}).Compiler
