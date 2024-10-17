'use client'
import { ChevronLeft, ChevronRight, File, Plus } from 'lucide-react'
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

export interface SupplyProduct {
  product: Product
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

  const [counter, setCounter] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  const indexOfLastSupply = currentPage * itemsPerPage
  const indexOfFirstSupply = indexOfLastSupply - itemsPerPage
  const currentSupplies = supplies.slice(indexOfFirstSupply, indexOfLastSupply)

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
    supplies.map((supply) => (supplyCounter += 1))
    setCounter(supplyCounter)
  }, [supplies])

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
                  >
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Exportar</span>
                  </Button>
                  <div className="max-sm:hidden">
                    <CreateSupplyDialog fetchSupplies={fetchSupplies} />
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
