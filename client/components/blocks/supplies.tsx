'use client'
import { ChevronLeft, ChevronRight, File, Plus, Search } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationItem
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
import CreateSupplyDialog from '@/components/custom/create-supply-dialog'
import { useEffect, useState } from 'react'
import { getSupplies } from '@/lib/api'
import SupplyTableRow from '@/components/custom/supply-table-row'
import { Product } from '@/components/blocks/products'
import { utils, writeFile } from 'xlsx'
import { v4 as uuidv4 } from 'uuid'

export interface SupplyProduct {
  product?: Product
  product_id: string
  quantity: number
}

export interface Supply {
  id: string
  commercial_id: string
  supply_date: string
  products_details: SupplyProduct[]
}

export function Supplies() {
  const [supplies, setSupplies] = useState<Supply[]>([])
  const [fetchError, setFetchError] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [counter, setCounter] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  const indexOfLastSupply = currentPage * itemsPerPage
  const indexOfFirstSupply = indexOfLastSupply - itemsPerPage
  const currentSupplies = supplies
    .filter((supply) => {
      const formattedDate = new Date(supply.supply_date)
        .toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
        .replace(/\//g, '') // Formata para "ddMMyyyy"
      return (
        supply.commercial_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formattedDate.includes(searchTerm)
      )
    })
    .slice(indexOfFirstSupply, indexOfLastSupply)

  const nextPage = () => {
    if (currentPage < Math.ceil(supplies.length / itemsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1)
    }
  }

  const fetchSupplies: () => Promise<void> = async () => {
    try {
      const suppliesData: Supply[] = await getSupplies()

      const sortedSupplies = suppliesData.sort((a: Supply, b: Supply) => {
        const regex = /([A-Za-z]+)(\d+)/
        const aMatch = a.commercial_id.match(regex)
        const bMatch = b.commercial_id.match(regex)

        if (aMatch && bMatch) {
          const [, aLetter, aNumber] = aMatch
          const [, bLetter, bNumber] = bMatch

          if (aLetter !== bLetter) {
            return aLetter.localeCompare(bLetter)
          }

          return parseInt(aNumber) - parseInt(bNumber)
        }

        return 0
      })

      setSupplies(sortedSupplies)
    } catch (e) {
      setFetchError(true)
    }
  }

  useEffect(() => {
    fetchSupplies()
  }, [])

  useEffect(() => {
    let supplyCounter = 0
    supplies
      .filter((supply) => {
        const formattedDate = new Date(supply.supply_date)
          .toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
          .replace(/\//g, '') // Formata para "ddMMyyyy"
        return (
          supply.commercial_id
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          formattedDate.includes(searchTerm)
        )
      })
      .map((supply) => (supplyCounter += 1))
    setCounter(supplyCounter)
  }, [searchTerm, supplies])

  const exportToExcel = () => {
    // Mapeie os dados de fornecimentos para o formato desejado
    const formattedSupplies = supplies.map((supply) => ({
      Código: supply.commercial_id,
      Data: new Date(supply.supply_date).toLocaleDateString('pt-BR'),
      Produtos: JSON.stringify(
        supply.products_details.map((productDetail) => ({
          commercial_id:
            productDetail.product && productDetail.product.commercial_id,
          quantity: productDetail.quantity,
          cost_price: productDetail.product && productDetail.product.cost_price,
          sell_price: productDetail.product && productDetail.product.sell_price
        }))
      ),
      'Valor Total': supply.products_details.reduce(
        (total, item) =>
          total + item.quantity * (item.product ? item.product.sell_price : 1),
        0
      )
    }))

    // Crie uma nova planilha a partir dos dados formatados
    const ws = utils.json_to_sheet(formattedSupplies)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Fornecimentos')

    // Obtenha a data atual no formato ddMMyyyy
    const currentDate = new Date()
      .toLocaleDateString('pt-BR')
      .replace(/\//g, '')

    // Gera um UUID para o nome do arquivo
    const uuid = uuidv4()

    // Cria o nome do arquivo no formato ddMMyyyy-fornecimentos-uuidv4.xlsx
    const fileName = `${currentDate}-fornecimentos-${uuid}.xlsx`

    // Exporta a planilha com o nome gerado
    writeFile(wb, fileName)
  }

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
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-sm"
                    onClick={exportToExcel}
                  >
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Exportar</span>
                  </Button>
                  <div className="max-sm:hidden">
                    <CreateSupplyDialog fetchSupplies={fetchSupplies} />
                  </div>
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
                        {currentSupplies.map((supply) => (
                          <SupplyTableRow
                            key={supply.id}
                            supply={supply}
                            fetchSupplies={fetchSupplies}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <div className="text-xs text-muted-foreground">
                      Mostrando{' '}
                      <strong>
                        {indexOfFirstSupply + 1}-
                        {Math.min(indexOfLastSupply, counter)}
                      </strong>{' '}
                      de <strong>{counter}</strong> fornecimentos
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
