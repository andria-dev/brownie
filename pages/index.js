import Link from 'next/link'
import '../global.css'

function Index() {
  return (
    <main>
      <Link to={`/post?id=22`}>
        <a className="text-blue no-underline">GO TO POST #22</a>
      </Link>
    </main>
  )
}

export default Index
