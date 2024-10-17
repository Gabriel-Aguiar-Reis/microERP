'use client'
import Image from 'next/image'
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  File,
  Plus,
  PlusCircle
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
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
import EditProductDialog from '@/components/custom/edit-product-dialog'
import AsideBar from '@/components/custom/aside-bar'
import Header from '@/components/custom/header'
import { getProducts } from '@/lib/api'
import { useEffect, useState } from 'react'
import ProductTableRow from '@/components/custom/product-table-row'
import DeleteProductDialog from '@/components/custom/delete-product-dialog'
import CreateProductDialog from '@/components/custom/create-product-dialog'
import { utils, writeFile } from 'xlsx'
import { v4 as uuidv4 } from 'uuid'

export interface Product {
  id: string
  commercial_id: string
  name: string
  description: string
  cost_price: number
  sell_price: number
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [fetchError, setFetchError] = useState(false)
  const [counter, setCounter] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  const updateProductInState = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    )
    setSelectedProduct(updatedProduct) // Atualiza o card do produto selecionado
  }

  const exportToExcel = (products: Product[]) => {
    // Mapeie os dados dos usuários para o formato desejado
    const formattedProducts = products.map((product) => ({
      Código: product.commercial_id,
      Nome: product.name,
      Preço_de_Custo: product.cost_price,
      Preço_de_Venda: product.sell_price,
      Descrição: product.description
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
    const fileName = `${currentDate}-produtos-${uuid}.xlsx`

    // Exporta a planilha com o nome gerado
    writeFile(wb, fileName)
  }

  const fetchProducts: () => Promise<void> = async () => {
    try {
      const productData: Product[] = await getProducts()

      // Função de ordenação
      const sortedProducts = productData.sort((a: Product, b: Product) => {
        // Extraia letras e números de ambos os produtos
        const regex = /([A-Za-z]+)(\d+)/
        const aMatch = a.commercial_id.match(regex) // Substitua `a.commercial_id` pelo campo correto que você está ordenando
        const bMatch = b.commercial_id.match(regex) // Substitua `b.commercial_id` pelo campo correto que você está ordenando

        if (aMatch && bMatch) {
          const [, aLetter, aNumber] = aMatch
          const [, bLetter, bNumber] = bMatch

          // Compare a parte alfabética
          if (aLetter !== bLetter) {
            return aLetter.localeCompare(bLetter)
          }

          // Compare a parte numérica como números
          return parseInt(aNumber) - parseInt(bNumber)
        }

        return 0 // Caso a string não tenha correspondência com o regex
      })

      setProducts(sortedProducts)
    } catch (e) {
      setFetchError(true)
    }
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
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  )

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
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 text-sm"
                    onClick={() => exportToExcel(products)}
                  >
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Exportar</span>
                  </Button>
                  <div className="max-sm:hidden">
                    <CreateProductDialog fetchProducts={fetchProducts} />
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
                          <TableHead className="hidden md:table-cell text-center">
                            Preço de Custo
                          </TableHead>
                          <TableHead className="hidden md:table-cell text-center">
                            Preço de Venda
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentProducts.map((product) => (
                          <ProductTableRow
                            func={() => setSelectedProduct(product)}
                            key={product.commercial_id}
                            productData={product}
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
          <div>
            {selectedProduct && (
              <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
                <CardHeader className="flex flex-row justify-between items-start bg-muted/50">
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                      {selectedProduct.name}
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Copy className="h-3 w-3" />
                        <span className="sr-only">
                          Copiar Código do Produto
                        </span>
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Código Comercial: {selectedProduct.commercial_id}
                    </CardDescription>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-auto flex items-center gap-2">
                      <DeleteProductDialog
                        selectedProduct={selectedProduct}
                        fetchProducts={fetchProducts}
                      />
                      <EditProductDialog
                        productData={selectedProduct}
                        func={fetchProducts}
                        updateProduct={updateProductInState}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                  <div>
                    <ul className="grid gap-3">
                      <li>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Preço de Custo</span>
                          <span>
                            {selectedProduct.cost_price.toLocaleString(
                              'pt-br',
                              {
                                style: 'currency',
                                currency: 'BRL'
                              }
                            )}
                          </span>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Preço de Venda</span>
                          <span>
                            {selectedProduct.sell_price.toLocaleString(
                              'pt-br',
                              {
                                style: 'currency',
                                currency: 'BRL'
                              }
                            )}
                          </span>
                        </div>
                      </li>
                      <Separator className="my-2" />
                      <li>
                        <span className="font-semibold">Descrição</span>
                      </li>
                      <li>
                        <div className="overflow-y-auto max-h-20 p-2 text-sm">
                          <p>{selectedProduct.description}</p>
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
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
