"use client"

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()

  return (
    <div className="w-64 flex justify-between">
      <button type="button" onClick={() => router.push('/login')}>
        Login
      </button>
      <button type="button" onClick={() => router.push('/products/all-products')}>
        Produtos
      </button>
      <button type="button" onClick={() => router.push('/sales/recent-sales')}>
        Vendas
      </button>
    </div>
  );
}
