'use client'
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  File,
  Plus,
  Search
} from 'lucide-react'
import { Input } from '@/components/ui/input'
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
import {
  getInventories,
  getInventoryProducts,
  getSales,
  getUsers
} from '@/lib/api'
import { useEffect, useState } from 'react'
import { User } from '@/components/blocks/sellers'
import SaleTableRow from '@/components/custom/sale-table-row'
import SaleProductCardRow from '@/components/custom/sale-product-card-row'
import CreateSaleDialog from '@/components/custom/create-sale-dialog'
import { Product } from '@/components/blocks/products'
import DeleteSaleDialog from '@/components/custom/delete-sale-dialog'
import { utils, writeFile } from 'xlsx'
import { v4 as uuidv4 } from 'uuid'
import { InventoryInterface } from '@/components/blocks/home'

export interface ProductDetails {
  product: Product
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
  const [counter, setCounter] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  const indexOfLastSale = currentPage * itemsPerPage
  const indexOfFirstSale = indexOfLastSale - itemsPerPage
  const currentSales = sales
    .filter((sale) => {
      // Encontra o vendedor correspondente
      const user = users.find((user) => user.id === sale.seller)
      const formattedDate = new Date(sale.sale_date)
        .toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
        .replace(/\//g, '') // Formata para "ddMMyyyy"

      // Verifica se o termo de pesquisa corresponde ao nome completo ou à data formatada
      return (
        user?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formattedDate.includes(searchTerm) ||
        sale.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
    .slice(indexOfFirstSale, indexOfLastSale)

  const [products, setProducts] = useState<ProductDetails[]>([])

  const fetchProducts: () => Promise<void> = async () => {
    try {
      const inventories: InventoryInterface[] = await getInventories()
      const inventoryId: string = inventories[0].id
      const productData: ProductDetails[] = await getInventoryProducts({
        inventoryId
      })

      const sortedProducts = productData.sort(
        (a: ProductDetails, b: ProductDetails) => {
          const regex = /([A-Za-z]+)(\d+)/
          const aMatch = a.product.commercial_id.match(regex)
          const bMatch = b.product.commercial_id.match(regex)

          if (aMatch && bMatch) {
            const [, aLetter, aNumber] = aMatch
            const [, bLetter, bNumber] = bMatch

            if (aLetter !== bLetter) {
              return aLetter.localeCompare(bLetter)
            }

            return parseInt(aNumber) - parseInt(bNumber)
          }

          return 0
        }
      )

      setProducts(sortedProducts)
    } catch (e) {}
  }

  const nextPage = () => {
    if (currentPage < Math.ceil(sales.length / itemsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1)
    }
  }

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

  const fetchUsers: () => Promise<void> = async () => {
    try {
      const response = await getUsers()
      setUsers(response)
    } catch (e) {}
  }

  const fetchSales: () => Promise<void> = async () => {
    try {
      const response = await getSales()
      const sortedSales = response.sort((a: Sale, b: Sale) => {
        return new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime()
      })
      setSales(sortedSales)
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

  const exportToExcel = () => {
    // Mapeie os dados dos usuários para o formato desejado
    const formattedSales = sales.map((sale) => ({
      Código: sale.id,
      Vendedor:
        getUserInfo(sale)?.first_name + ' ' + getUserInfo(sale)?.last_name,
      Data: new Date(sale.sale_date).toLocaleDateString('pt-BR'),
      Produtos: JSON.stringify(
        sale.products_details.map((productDetail) => ({
          commercial_id:
            productDetail.product && productDetail.product.commercial_id,
          quantity: productDetail.quantity,
          cost_price: productDetail.product && productDetail.product.cost_price,
          sell_price: productDetail.product && productDetail.product.sell_price
        }))
      ),
      Quantidade: sale.products_details.reduce(
        (total, item) => total + item.quantity,
        0
      ),
      'Custo Total': sale.products_details.reduce(
        (total, item) =>
          total + item.quantity * (item.product ? item.product.cost_price : 1),
        0
      ),
      'Venda Total': sale.products_details.reduce(
        (total, item) =>
          total + item.quantity * (item.product ? item.product.sell_price : 1),
        0
      )
    }))

    // Crie uma nova planilha a partir dos dados formatados
    const ws = utils.json_to_sheet(formattedSales)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Vendas')

    // Obtenha a data atual no formato ddMMyyyy
    const currentDate = new Date()
      .toLocaleDateString('pt-BR')
      .replace(/\//g, '')

    // Gera um UUID para o nome do arquivo
    const uuid = uuidv4()

    // Cria o nome do arquivo no formato ddMMyyyy-vendedores-uuidv4.xlsx
    const fileName = `${currentDate}-vendas-${uuid}.xlsx`

    // Exporta a planilha com o nome gerado
    writeFile(wb, fileName)
  }

  useEffect(() => {
    fetchUsers()
    fetchSales()
    fetchProducts()
  }, [])

  useEffect(() => {
    let saleCounter = 0
    sales
      .filter((sale) => {
        // Encontra o vendedor correspondente
        const user = users.find((user) => user.id === sale.seller)
        const formattedDate = new Date(sale.sale_date)
          .toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
          .replace(/\//g, '') // Formata para "ddMMyyyy"

        // Verifica se o termo de pesquisa corresponde ao nome completo ou à data formatada
        return (
          user?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          formattedDate.includes(searchTerm) ||
          sale.id.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
      .map((sale) => (saleCounter += 1))
    setCounter(saleCounter)
  }, [sales, searchTerm, users])

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
                    onClick={exportToExcel}
                  >
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Exportar</span>
                  </Button>
                  <CreateSaleDialog
                    fetchSales={fetchSales}
                    products={products}
                    fetchProducts={fetchProducts}
                  />
                  <div className="relative ml-auto flex-1 md:grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground translate-y-0.5" />
                    <Input
                      type="search"
                      placeholder="Pesquisar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                    />
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
                        {currentSales.map((sale) => (
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
                      Mostrando{' '}
                      <strong>
                        {indexOfFirstSale + 1}-
                        {Math.min(indexOfLastSale, counter)}
                      </strong>{' '}
                      de <strong>{counter}</strong> vendas
                    </div>
                    <Pagination className="ml-auto mr-0 w-auto">
                      <PaginationContent>
                        <PaginationItem>
                          <Button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                            <span className="sr-only">Anterior</span>
                          </Button>
                        </PaginationItem>
                        <PaginationItem>
                          <Button
                            onClick={nextPage}
                            disabled={
                              currentPage === Math.ceil(counter / itemsPerPage)
                            }
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                            <span className="sr-only">Próximo</span>
                          </Button>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
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
                      <DeleteSaleDialog
                        selectedSale={selectedSale}
                        fetchSales={fetchSales}
                        fetchProducts={fetchProducts}
                      />
                      {/* <Button size="sm" className="h-8 gap-1">
                        <PencilRuler className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Editar
                        </span>
                      </Button> */}
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
