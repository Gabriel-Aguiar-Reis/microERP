import { Sellers } from '@/components/blocks/sellers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'microERP | Vendedores'
}

export default function Home() {
  return <Sellers />
}
