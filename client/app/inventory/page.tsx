import { Inventory } from '@/components/blocks/inventory'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'microERP | Estoque'
}

export default function Home() {
  return <Inventory />
}
