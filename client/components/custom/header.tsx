'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Home,
  Package,
  PanelLeft,
  Search,
  ShoppingCart,
  Store,
  Truck,
  User,
  Users2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Input } from '@/components/ui/input'

interface HeaderProps {
  breadcrumbName?: string
  inventoryName?: string
}

export default function Header({ breadcrumbName, inventoryName }: HeaderProps) {
  const router = useRouter()
  function handleQuit(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    router.push('/login')
  }

  const handleConfig = () => {
    window.location.href = '/settings'
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Menu Lateral</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-slate-900 text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
              >
                <Button size="icon" className="overflow-hidden rounded-full">
                  <User
                    color="white"
                    className="h-4 w-4 transition-all group-hover:scale-110"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mx-12">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Configurações</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/home"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Home className="h-5 w-5" />
              Tela Inicial
            </Link>
            <Link
              href="/inventory"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Store className="h-5 w-5" />
              Estoque
            </Link>
            <Link
              href="/sales"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <ShoppingCart className="h-5 w-5" />
              Vendas
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Package className="h-5 w-5" />
              Produtos
            </Link>
            <Link
              href="/supplies"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Truck className="h-5 w-5" />
              Fornecimentos
            </Link>
            <Link
              href="/sellers"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Users2 className="h-5 w-5" />
              Vendedores
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/home">Tela Inicial</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {breadcrumbName ? (
            <BreadcrumbItem>
              <BreadcrumbPage>{breadcrumbName}</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <h1 className="rounded-md bg-slate-100 text-slate-500 px-2">
              {inventoryName}
            </h1>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground translate-y-0.5" />
        <Input
          type="search"
          placeholder="Pesquisar..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
      <div className="max-sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-slate-900 text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Button size="icon" className="overflow-hidden rounded-full">
              <User
                color="white"
                className="h-4 w-4 transition-all group-hover:scale-110"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mx-12">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleConfig}>
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleQuit}>
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
