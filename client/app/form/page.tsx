import SaleForm from '@/components/blocks/sale_form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'microERP | Form de Vendas'
}

export default function Home() {
  return <SaleForm />
}
