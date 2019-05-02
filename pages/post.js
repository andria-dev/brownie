import { withRouter } from 'next/router'

import '../global.css'

function Post({ router }) {
  return <p className="text-blue">{router.query.id}</p>
}

export default withRouter(Post)
