import { SellerLoginForm } from '@/components/blocks/seller-login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'microERP | Vendedor - Entrar'
}

export default function Home() {
  return <SellerLoginForm />
}
