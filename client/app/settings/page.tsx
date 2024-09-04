import { SettingsPage } from '@/components/blocks/settings'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'microERP | Configurações'
}

export default function Home() {
  return <SettingsPage />
}
