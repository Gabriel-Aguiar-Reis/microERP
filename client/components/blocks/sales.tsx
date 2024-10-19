'use client'
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  File,
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
  Pagination,
  PaginationContent,
  PaginationItem
} from '@/components/ui/pagination'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import AsideBar from '@/components/custom/aside-bar'
import Header from '@/components/custom/header'
import { getSales, getUsers } from '@/lib/api'
import { useEffect, useState } from 'react'
import { User } from '@/components/blocks/sellers'
import SaleTableRow from '@/components/custom/sale-table-row'
import SaleProductCardRow from '@/components/custom/sale-product-card-row'

export interface ProductDetails {
  product: {
    commercial_id: string
    cost_price: number
    description: string
    id: string
    name: string
    sell_price: number
  }
  quantity: number
}

export interface Sale {
  id: string
  inventory: string
  products_details: ProductDetails[]
  sale_date: string
  seller: string
  payment_method: string
}

export function Sales() {
  const [sales, setSales] = useState<Sale[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)

  function formatDate(sale_date: string): string {
    const date = new Date(sale_date)
    return date.toLocaleDateString('pt-BR')
  }

  function getTotalSalePrice() {
    let totalSalePrice = 0
    if (selectedSale) {
      selectedSale.products_details.map((detail) => {
        let productTotal = detail.product.sell_price * detail.quantity
        totalSalePrice += productTotal
      })
    }
    return totalSalePrice.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const fetchSales: () => Promise<void> = async () => {
    try {
      const response = await getSales()
      setSales(response)
    } catch (e) {}
  }

  const fetchUsers: () => Promise<void> = async () => {
    try {
      const response = await getUsers()
      setUsers(response)
    } catch (e) {}
  }

  function getUserInfo(selectedSale: Sale) {
    if (selectedSale) {
      const userInfo: User = users.filter(
        (user) => user.id === selectedSale.seller
      )[0]
      return userInfo
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchSales()
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 bg-muted/40">
      <AsideBar section="Sales" />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header breadcrumbName="Vendas" />
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
                        Criar Nova Venda
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
              <TabsContent value="all">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
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
                          <TableHead className="text-center">
                            Produtos
                          </TableHead>
                          <TableHead className="text-center">
                            Qte. Produtos
                          </TableHead>
                          <TableHead className="text-center">
                            Custo Total
                          </TableHead>
                          <TableHead className="text-center">
                            Venda Total
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sales.map((sale) => (
                          <SaleTableRow
                            key={sale.id}
                            mapedSale={sale}
                            users={users}
                            func={() => setSelectedSale(sale)}
                          />
                        ))}
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
          <div>
            {selectedSale && (
              <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
                <CardHeader className="flex flex-row justify-between items-start bg-muted/50">
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                      Venda {selectedSale.id}
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Copy className="h-3 w-3" />
                        <span className="sr-only">Copiar Código da Venda</span>
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Data: {formatDate(selectedSale.sale_date)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-auto flex items-center gap-2">
                      <div className="flex">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 gap-1 text-sm"
                        >
                          <span className="sr-only sm:not-sr-only">
                            Deletar
                          </span>
                        </Button>
                      </div>
                      {/* <EditProductDialog /> */}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                  <div className="grid gap-3">
                    <div className="font-semibold">Detalhes da Venda</div>
                    <ul className="grid gap-3">
                      {selectedSale.products_details.map((productDetail) => (
                        <SaleProductCardRow
                          key={productDetail.product.commercial_id}
                          productData={productDetail}
                        />
                      ))}
                    </ul>
                    <Separator className="my-2" />
                    <ul className="grid gap-3">
                      <li className="flex items-center justify-between font-semibold">
                        <span className="text-muted-foreground">Total</span>
                        <span>{getTotalSalePrice()}</span>
                      </li>
                      <li>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">
                            Método de Pagamento
                          </span>
                          <span>{selectedSale.payment_method}</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-semibold">Informações do Vendedor</div>
                    <dl className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Vendedor</dt>
                        <dd>{getUserInfo(selectedSale)?.fullName}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Email</dt>
                        <dd>
                          <a href="mailto:">
                            {getUserInfo(selectedSale)?.email}
                          </a>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
