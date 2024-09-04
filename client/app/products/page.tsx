import { Products } from '@/components/blocks/products'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'microERP | Produtos'
}

export default function Home() {
  return <Products />
}
