'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Truck,
  Users2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

interface AsideBarProps {
  section: string
}

export default function AsideBar({ section }: AsideBarProps) {
  const router = useRouter()

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-white sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Button
          size="icon"
          className="overflow-hidden rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft
            color="white"
            className="h-5 w-5 transition-all group-hover:scale-110"
          />
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/home"
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${
                  section === 'Home' ? 'bg-slate-200' : ''
                }`}
              >
                <Home className="h-5 w-5" />
                <span className="sr-only">Tela Inicial</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Tela Inicial</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/inventory"
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${
                  section === 'Inventory' ? 'bg-slate-200' : ''
                }`}
              >
                <Store className="h-5 w-5" />
                <span className="sr-only">Estoque</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Estoque</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/sales"
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${
                  section === 'Sales' ? 'bg-slate-200' : ''
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Vendas</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Vendas</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/products"
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${
                  section === 'Products' ? 'bg-slate-200' : ''
                }`}
              >
                <Package className="h-5 w-5" />
                <span className="sr-only">Produtos</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Produtos</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/supplies"
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${
                  section === 'Supplies' ? 'bg-slate-200' : ''
                }`}
              >
                <Truck className="h-5 w-5" />
                <span className="sr-only">Fornecimentos</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Fornecimentos</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/sellers"
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${
                  section === 'Sellers' ? 'bg-slate-200' : ''
                }`}
              >
                <Users2 className="h-5 w-5" />
                <span className="sr-only">Vendedores</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Vendedores</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/settings"
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${
                  section === 'Settings' ? 'bg-slate-200' : ''
                }`}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Configurações</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Configurações</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  )
}
