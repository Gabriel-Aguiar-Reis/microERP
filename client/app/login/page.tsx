import { LoginForm } from '@/components/blocks/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'microERP | Entrar'
}

export default function Home() {
  return <LoginForm />
}
