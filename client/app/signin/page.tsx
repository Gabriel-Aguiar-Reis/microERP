import { SignInForm } from '@/components/blocks/signin-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'microERP | Cadastrar'
}

export default function Home() {
  return <SignInForm />
}
