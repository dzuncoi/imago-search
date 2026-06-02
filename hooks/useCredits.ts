'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type FacetsResponse = { credits: string[] }

async function fetchCredits(): Promise<string[]> {
  const res = await axios.get<FacetsResponse>('/api/facets')
  return res.data.credits
}

export function useCredits() {
  return useQuery({
    queryKey: ['facets', 'credits'],
    queryFn: fetchCredits,
    staleTime: Infinity,
  })
}
