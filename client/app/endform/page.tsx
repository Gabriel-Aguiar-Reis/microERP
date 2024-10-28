import EndSaleForm from '@/components/blocks/end-sale-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'microERP | Form de Vendas'
}

export default function Home() {
  return <EndSaleForm />
}
