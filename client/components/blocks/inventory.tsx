'use client'
import { File, ListFilter, Plus, PlusCircle } from 'lucide-react'

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import AsideBar from '@/components/custom/aside-bar'
import Header from '@/components/custom/header'

export function Inventory() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 bg-muted/40">
      <AsideBar section="Inventory" />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header breadcrumbName="Estoque" />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="fixed top-100 bottom-4 right-4">
            <Button
              size="icon"
              className="sm:hidden overflow-hidden rounded-full"
            >
              <Plus color="white" className="h-4 w-4" />
            </Button>
          </div>
          <div className="lg:col-span-2">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 mb-8">
              <Tabs defaultValue="all">
                <div className="flex items-center">
                  <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1"
                        >
                          <ListFilter className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only">
                            Filtrar
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked>
                          Active
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>
                          Draft
                        </DropdownMenuCheckboxItem>
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
                  </div>
                </div>
                <TabsContent value="all">
                  <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                      <CardTitle>Produtos</CardTitle>
                      <CardDescription>
                        Produtos presentes no estoque.
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
                              Preço de Venda
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Un.
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Fornecimento
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
                              R$ 19,99
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              15
                            </TableCell>
                            <TableCell>
                              <Badge className="text-xs" variant="secondary">
                                F082024
                              </Badge>
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
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <Tabs defaultValue="all">
                <div className="flex items-center">
                  <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1"
                        >
                          <ListFilter className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only">
                            Filtrar
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked>
                          Active
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>
                          Draft
                        </DropdownMenuCheckboxItem>
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
                          Criar Nova Venda
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
                <TabsContent value="all">
                  <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                      <CardTitle>Vendas</CardTitle>
                      <CardDescription>
                        Vendas recentes do seu estoque.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Código</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Vendedor
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Data
                            </TableHead>
                            <TableHead className="text-right">
                              Valor Total
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="bg-accent">
                            <TableCell>
                              <Badge className="text-xs" variant="secondary">
                                AB013C
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="font-medium">Liam Johnson</div>
                              <div className="hidden text-sm text-muted-foreground md:inline">
                                liam@example.com
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              2023-11-23
                            </TableCell>
                            <TableCell className="text-right">
                              R$329,00
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter>
                      <div className="text-xs text-muted-foreground">
                        Mostrando <strong>1-10</strong> de <strong>1</strong>{' '}
                        vendas
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div>
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Vendedores</CardTitle>
                <CardDescription>
                  Vendedores associados ao estoque.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Cargo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="grid gap-1">
                          <p className="text-sm font-medium leading-none">
                            Sofia Davis
                          </p>
                          <p className="text-sm text-muted-foreground">
                            sofia.davis@email.com
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ul>
                          <li>
                            <Badge variant="secondary">Vendedor</Badge>
                          </li>
                        </ul>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="grid gap-1">
                          <p className="text-sm font-medium leading-none">
                            Max Robinson
                          </p>
                          <p className="text-sm text-muted-foreground">
                            max.robin@email.com
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ul>
                          <li>
                            <Badge variant="secondary" className="mb-1">
                              Vendedor
                            </Badge>
                          </li>
                          <li>
                            <Badge variant="secondary">Administrador</Badge>
                          </li>
                        </ul>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Mostrando <strong>1-10</strong> de <strong>2</strong>{' '}
                  vendedores
                </div>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
