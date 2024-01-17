import { getApiDocs } from './swagger'

// import ReactSwagger from './react-swagger'
import dynamic from 'next/dynamic'
const ReactSwagger = dynamic(() => import('./react-swagger'), {
  ssr: false,
})

export default function Page() {
  const spec = getApiDocs()
  return <ReactSwagger spec={spec} />
}
