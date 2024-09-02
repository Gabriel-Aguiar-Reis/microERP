'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div className="w-auto flex justify-between">
      <ul>
        <li>
          <button type="button" onClick={() => router.push('/login')}>
            Login
          </button>
        </li>
        <li>
          <button type="button" onClick={() => router.push('/products')}>
            Produtos
          </button>
        </li>
        <li>
          <button type="button" onClick={() => router.push('/sales')}>
            Vendas
          </button>
        </li>
      </ul>
    </div>
  )
}
