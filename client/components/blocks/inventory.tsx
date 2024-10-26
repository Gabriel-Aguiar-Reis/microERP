'use client'
import { ChevronLeft, ChevronRight, File, Plus, Search } from 'lucide-react'
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
  Table,
  TableBody,
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
import AsideBar from '@/components/custom/aside-bar'
import Header from '@/components/custom/header'
import { getInventoryProducts } from '@/lib/api'
import { useEffect, useState } from 'react'
import ProductTableRow from '@/components/custom/product-table-row'
import { utils, writeFile } from 'xlsx'
import { v4 as uuidv4 } from 'uuid'
import { ProductDetails } from '@/components/blocks/sales'

export function Inventory() {
  const [products, setProducts] = useState<ProductDetails[]>([])
  const [fetchError, setFetchError] = useState(false)
  const [counter, setCounter] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4
  const filteredProducts = products.filter((detail) => detail.quantity > 0)
  const exportToExcel = () => {
    // Mapeie os dados dos usuários para o formato desejado
    const formattedProducts = filteredProducts.map((detail) => ({
      Código: detail.product.commercial_id,
      Nome: detail.product.name,
      Preço_de_Custo: detail.product.cost_price,
      Preço_de_Venda: detail.product.sell_price,
      Descrição: detail.product.description,
      Quantidade: detail.quantity
    }))

    // Crie uma nova planilha a partir dos dados formatados
    const ws = utils.json_to_sheet(formattedProducts)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Produtos')

    // Obtenha a data atual no formato ddMMyyyy
    const currentDate = new Date()
      .toLocaleDateString('pt-BR')
      .replace(/\//g, '')

    // Gera um UUID para o nome do arquivo
    const uuid = uuidv4()

    // Cria o nome do arquivo no formato ddMMyyyy-vendedores-uuidv4.xlsx
    const fileName = `${currentDate}-estoque-${uuid}.xlsx`

    // Exporta a planilha com o nome gerado
    writeFile(wb, fileName)
  }

  const fetchProducts: () => Promise<void> = async () => {
    try {
      const inventoryId: string = 'd07e8795-3d6d-4d1e-b810-39f23933dc35'
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

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    let productsCounter = 0
    products.map(() => (productsCounter += 1))
    setCounter(productsCounter)
  }, [products])

  // Filtrar usuários da página atual
  const indexOfLastProduct = currentPage * itemsPerPage
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage
  const currentProducts = products
    .filter((detail) => detail.quantity > 0) // Produtos com quantidade > 0
    .filter(
      (detail) =>
        detail.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detail.product.commercial_id
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) // Filtrar pelo nome ou ID
    )
    .slice(indexOfFirstProduct, indexOfLastProduct)

  // Navegação de página
  const nextPage = () => {
    if (currentPage < Math.ceil(products.length / itemsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 bg-muted/40">
      <AsideBar section="Inventory" />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header breadcrumbName="Estoque" />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="fixed top-100 bottom-4 right-4">
            <Button
              size="icon"
              className="sm:hidden overflow-hidden rounded-full"
            >
              <Plus color="white" className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid auto-rows-max items-start gap-4 md:gap-8">
            <Tabs defaultValue="all">
              <div className="flex items-center">
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 text-sm"
                    onClick={() => exportToExcel()}
                  >
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Exportar</span>
                  </Button>
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
                          <TableHead className="hidden md:table-cell text-center">
                            Preço de Custo
                          </TableHead>
                          <TableHead className="hidden md:table-cell text-center">
                            Preço de Venda
                          </TableHead>
                          <TableHead className="hidden md:table-cell text-center">
                            Quantidade
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentProducts.map((detail) => (
                          <ProductTableRow
                            key={detail.product.id}
                            productData={detail.product}
                            isInInventoryTable={true}
                            quantity={detail.quantity}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <div className="text-xs text-muted-foreground">
                      Mostrando{' '}
                      <strong>
                        {indexOfFirstProduct + 1}-
                        {Math.min(indexOfLastProduct, counter)}
                      </strong>{' '}
                      de <strong>{counter}</strong> produtos
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
        </main>
      </div>
    </div>
  )
}
