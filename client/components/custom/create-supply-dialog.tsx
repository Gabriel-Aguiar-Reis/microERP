import { PlusCircle, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import ProductTableRow from '@/components/custom/product-table-row'
import { Product } from '@/components/blocks/products'
import { useEffect, useState } from 'react'
import { getProducts, postSupply } from '@/lib/api'
import SupplyCard from '@/components/custom/supply-card'
import { SupplyProduct } from '@/components/blocks/supplies'

export default function CreateSupplyDialog({
  fetchSupplies
}: {
  fetchSupplies: () => Promise<void>
}) {
  const [commercialId, setCommercialId] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [fetchError, setFetchError] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<SupplyProduct[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('') // New state for search input
  const [commercialIdError, setCommercialIdError] = useState('')

  const handleBlurCommercialId = () => {
    if (!commercialId) {
      setCommercialIdError('O Código de fornecimento não pode estar vazio.')
    } else {
      setCommercialIdError('')
    }
  }

  const fetchProducts: () => Promise<void> = async () => {
    try {
      const productData: Product[] = await getProducts()

      const sortedProducts = productData.sort((a: Product, b: Product) => {
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

      setProducts(sortedProducts)
    } catch (e) {
      setFetchError(true)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleAddProduct = (product: Product) => {
    setSelectedProducts((prevProducts) => {
      const existingProduct = prevProducts.find(
        (p) => p.product_id === product.id
      )

      if (existingProduct) {
        return prevProducts.map((p) =>
          p.product_id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      } else {
        return [...prevProducts, { product_id: product.id, quantity: 1 }]
      }
    })
  }

  const handleAddQty = (selectedProduct: SupplyProduct) => {
    setSelectedProducts((prevProducts) => {
      return prevProducts.map((p) =>
        p.product_id === selectedProduct.product_id
          ? { ...p, quantity: p.quantity + 1 }
          : p
      )
    })
  }

  const handleSubQty = (selectedProduct: SupplyProduct) => {
    setSelectedProducts((prevProducts) => {
      const existingProduct = prevProducts.find(
        (p) => p.product_id === selectedProduct.product_id
      )

      if (existingProduct) {
        if (existingProduct.quantity > 1) {
          return prevProducts.map((p) =>
            p.product_id === selectedProduct.product_id
              ? { ...p, quantity: p.quantity - 1 }
              : p
          )
        } else {
          return prevProducts.filter(
            (p) => p.product_id !== selectedProduct.product_id
          )
        }
      }
      return prevProducts
    })
  }

  const handleClick = async () => {
    try {
      await postSupply({
        commercialId,
        selectedProducts,
        inventoryId: 'd07e8795-3d6d-4d1e-b810-39f23933dc35',
        fetchSupplies
      })
    } catch (e) {
      return Promise.reject(e)
    }
  }

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setSelectedProducts([])
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.commercial_id.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by name or commercial ID
  )

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger className="h-8 gap-1">
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Criar Novo Fornecimento
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1200px] sm:max-h-[720px] sm:min-w-[1000px] sm:min-h-[600px] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Criar Novo Fornecimento</DialogTitle>
          <DialogDescription>
            Insira as informações necessárias para criar o fornecimento.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 items-center">
          <Label htmlFor="text">Código de Fornecimento</Label>
          <Input
            id="commerical_id"
            className="ml-2 max-w-[400px]"
            onChange={(e) => setCommercialId(e.target.value)}
            onBlur={handleBlurCommercialId}
          ></Input>
          <div className="gap-2">
            {commercialIdError && (
              <div className="text-red-500 text-sm p-2 bg-red-100 rounded-md">
                <p>{commercialIdError}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4">
          <Card className="col-span-3 h-[360px] overflow-scroll">
            <CardHeader>
              <div className="flex items-center">
                <CardDescription>Lista de Produtos</CardDescription>
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
                  {filteredProducts.map((product) => (
                    <ProductTableRow
                      key={product.commercial_id}
                      productData={product}
                      isInSupplyPostDialog={true}
                      SupplyDialogFunc={() => handleAddProduct(product)}
                    />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="ml-4 max-h-[360px] overflow-scroll">
            <CardHeader>
              <CardDescription>Listagem do Fornecimento</CardDescription>
            </CardHeader>
            <CardContent>
              <ul>
                {selectedProducts.map((selectedProduct) => (
                  <li className="mb-2" key={selectedProduct.product_id}>
                    <SupplyCard
                      key={selectedProduct.product_id}
                      product={products.find(
                        (product) => product.id === selectedProduct.product_id
                      )}
                      quantity={selectedProduct.quantity}
                      handleAddQty={handleAddQty}
                      handleSubQty={handleSubQty}
                      selectedProduct={selectedProduct}
                    />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <DialogFooter>
          {!commercialIdError ? (
            <DialogClose>
              <Button onClick={handleClick} type="submit">
                Criar
              </Button>
            </DialogClose>
          ) : (
            <Button disabled={true} type="submit">
              Criar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
