"use client"

import { useRouter } from "next/navigation";

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
          <button type="button" onClick={() => router.push('/products/all-products')}>
          Produtos
        </button>
        </li>
        <li>
          <button type="button" onClick={() => router.push('/products/edit-product')}>
          Editar Produto
        </button>
        </li>
        <li>
          <button type="button" onClick={() => router.push('/sales/recent-sales')}>
          Vendas
        </button>
        </li>
      </ul>
    </div>
  );
}
