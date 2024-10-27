import { SellerSignInForm } from '@/components/blocks/seller-signin-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'microERP | Vendedor - Cadastrar'
}

export default function Home() {
  return <SellerSignInForm />
}
