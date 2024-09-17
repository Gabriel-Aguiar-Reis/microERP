import Image from 'next/image'
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  File,
  ListFilter,
  Plus,
  PlusCircle
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import {
  Pagination,
  PaginationContent,
  PaginationItem
} from '@/components/ui/pagination'
import EditProductDialog from '@/components/custom/edit-product-dialog'
import AsideBar from '@/components/custom/aside-bar'
import Header from '@/components/custom/header'

export function Products() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 bg-muted/40">
      <AsideBar section="Products" />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header breadcrumbName="Produtos" />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="fixed top-100 bottom-4 right-4">
            <Button
              size="icon"
              className="sm:hidden overflow-hidden rounded-full"
            >
              <Plus color="white" className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Tabs defaultValue="all">
              <div className="flex items-center">
                <div className="ml-auto flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Filtrar</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem checked>
                        Active
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Archived
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 text-sm"
                  >
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Exportar</span>
                  </Button>
                  <div className="max-sm:hidden">
                    <Button size="sm" className="h-8 gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Criar Novo Produto
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
              <TabsContent value="all">
                <Card x-chunk="dashboard-06-chunk-0">
                  <CardHeader>
                    <CardTitle>Produtos</CardTitle>
                    <CardDescription>
                      Produtos criados e relacionados aos fornecimentos e
                      estoque.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="hidden sm:table-cell">
                            Imagem
                          </TableHead>
                          <TableHead>Código</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead className="hidden md:table-cell">
                            Preço de Custo
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Preço de Venda
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="hidden sm:table-cell">
                            <div className="bg-slate-200 rounded-lg h-16 w-16"></div>
                          </TableCell>
                          <TableCell>
                            <Badge className="text-xs" variant="secondary">
                              PD01
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            Laser Lemonade Machine
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            R$ 9,99
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            R$ 19,99
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <div className="text-xs text-muted-foreground">
                      Mostrando <strong>1-10</strong> de <strong>1</strong>{' '}
                      produtos
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
              <CardHeader className="flex flex-row justify-between items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Nome do Produto
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">Copiar Código do Produto</span>
                    </Button>
                  </CardTitle>
                  <CardDescription>Código Comercial: PD01</CardDescription>
                </div>
                <div className="flex items-center">
                  <div className="ml-auto flex items-center gap-2">
                    <div className="flex">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 gap-1 text-sm"
                      >
                        <span className="sr-only sm:not-sr-only">Deletar</span>
                      </Button>
                    </div>
                    <EditProductDialog />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div>
                  <ul className="grid gap-3">
                    <li>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Preço de Custo</span>
                        <span>R$ 9,99</span>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Preço de Venda</span>
                        <span>R$ 19,99</span>
                      </div>
                    </li>
                    <Separator className="my-2" />
                    <li>
                      <span className="font-semibold">Descrição</span>
                    </li>
                    <li>
                      <div className="overflow-y-auto max-h-20 p-2 text-sm">
                        <p>Uma descrição de produto.</p>
                      </div>
                    </li>
                    <Separator className="my-2" />
                    <li>
                      <span className="font-semibold">Imagem</span>
                      <div className="self-center p-2">
                        <Image
                          alt="Imagem do produto"
                          className="aspect-square bg-slate-200 rounded-lg m-auto object-cover"
                          height="200"
                          src=""
                          width="200"
                        />
                      </div>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <div className="text-xs text-muted-foreground">
                  Atualizado{' '}
                  <time dateTime="2023-11-23">23 de Novembro de 2023</time>
                </div>
                <Pagination className="ml-auto mr-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <ChevronLeft className="h-3.5 w-3.5" />
                        <span className="sr-only">Produto Anterior</span>
                      </Button>
                    </PaginationItem>
                    <PaginationItem>
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span className="sr-only">Próximo Produto</span>
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
