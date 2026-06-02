import { getIndex } from '@/lib/search'

export async function GET() {
  const index = getIndex()
  return Response.json({ credits: index.getCredits() })
}
