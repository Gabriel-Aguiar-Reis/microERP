import {
  Expand,
  File,
  ListFilter,
  Plus,
  PlusCircle,
  Trash2
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

export function Supplies() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 bg-muted/40">
      <AsideBar section="Supplies" />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header breadcrumbName="Fornecimentos" />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="fixed top-100 bottom-4 right-4">
            <Button
              size="icon"
              className="sm:hidden overflow-hidden rounded-full"
            >
              <Plus color="white" className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3 ">
            <Tabs defaultValue="all">
              <div className="flex items-center">
                <div className="ml-auto flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-sm"
                      >
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Filtrar</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem checked>
                        Fulfilled
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Declined
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Refunded
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-sm"
                  >
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Exportar</span>
                  </Button>
                  <div className="max-sm:hidden">
                    <Button size="sm" className="h-8 gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Criar Novo Fornecimento
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
              <TabsContent value="all">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Fornecimento</CardTitle>
                    <CardDescription>
                      Fornecimentos recentes do seu estoque.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código</TableHead>
                          <TableHead className="hidden md:table-cell">
                            Registrado por
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Data
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Produtos
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Valor Total
                          </TableHead>
                          <TableHead className="hidden md:table-cell"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="bg-accent">
                          <TableCell>
                            <Badge className="text-xs" variant="secondary">
                              F082024
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
                          <TableCell className="hidden md:table-cell">
                            <div className="flex">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1 text-sm items-center"
                              >
                                <Expand className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only">
                                  Visualizar
                                </span>
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            R$329,00
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1 text-sm items-center"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only">
                                  Deletar
                                </span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <div className="text-xs text-muted-foreground">
                      Mostrando <strong>1-10</strong> de <strong>1</strong>{' '}
                      fornecimentos
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
