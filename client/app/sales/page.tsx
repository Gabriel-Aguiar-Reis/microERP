import { Sales } from '@/components/blocks/sales'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'microERP | Vendas'
}

export default function Home() {
  return <Sales />
}
