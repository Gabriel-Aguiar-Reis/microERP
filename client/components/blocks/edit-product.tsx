import Link from "next/link"
import {
  ArrowLeft,
  ChevronLeft,
  Home,
  Package,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  User,
  Users2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"

export function EditProduct() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Button size="icon" className="overflow-hidden rounded-full">
            <ArrowLeft color="white" className="h-5 w-5 transition-all group-hover:scale-110" />
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
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
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
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
                  href="#"
                  className="bg-slate-200 flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
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
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
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
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
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
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
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
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
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
                  <DropdownMenuTrigger asChild className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-slate-900 text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
                    <Button
                      size="icon"
                      className="overflow-hidden rounded-full"
                    >
                      <User color="white" className="h-4 w-4 transition-all group-hover:scale-110" />
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
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Tela Inicial
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Vendas
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Produtos
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Truck className="h-5 w-5" />
                  Fornecimentos
                </Link>
                <Link
                  href="#"
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
                  <Link href="/">Tela Inicial</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Produtos</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Editar Produto</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <DropdownMenu>
              <DropdownMenuTrigger asChild className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-slate-900 text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
                <Button
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <User color="white" className="h-4 w-4 transition-all group-hover:scale-110" />
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
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Voltar</span>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Nome do Produto
              </h1>
              <Badge variant="outline" className="ml-auto sm:ml-0">
                Em estoque
              </Badge>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm">
                  Cancelar
                </Button>
                <Button size="sm" variant="secondary">
                  Deletar
                </Button>
                <Button size="sm">Salvar</Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-2 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Detalhes do produto</CardTitle>
                    <CardDescription>
                      Veja e edite as características do produto.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="commercial-id">Código Comercial</Label>
                        <Input
                          id="commercial-id"
                          type="text"
                          className="w-full"
                          defaultValue="Código do Produto"
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full"
                          defaultValue="Nome do produto"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="flex gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="price">Preço de custo</Label>
                          <Input
                            id="price"
                            type="number"
                            defaultValue="9.99"
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="price">Preço de venda</Label>
                          <Input
                            id="price"
                            type="number"
                            defaultValue="19.99"
                          />
                        </div>
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          defaultValue="Descrição do produto."
                          className="min-h-32"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button variant="secondary" size="sm">
                Deletar
              </Button>
              <Button variant="outline" size="sm">
                Cancelar
              </Button>
              <Button size="sm">Salvar</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
