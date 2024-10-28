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
import {
  getInventoryProducts,
  getProducts,
  postSale,
  postSupply
} from '@/lib/api'
import SupplyCard from '@/components/custom/supply-card'
import { SupplyProduct } from '@/components/blocks/supplies'
import { User } from '@/components/blocks/sellers'
import { ProductDetails } from '@/components/blocks/sales'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export default function CreateSaleDialog({
  fetchSales,
  products,
  fetchProducts
}: {
  fetchSales: () => Promise<void>
  products: ProductDetails[]
  fetchProducts: () => Promise<void>
}) {
  const [paymentMethod, setPaymentMethod] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<SupplyProduct[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

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
      const productInStock = products.find(
        (p) => p.product.id === selectedProduct.product_id
      )

      if (
        productInStock &&
        selectedProduct.quantity < productInStock.quantity
      ) {
        return prevProducts.map((p) =>
          p.product_id === selectedProduct.product_id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      } else {
        return prevProducts // If the quantity exceeds stock, do nothing
      }
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
      await postSale({
        paymentMethod,
        products: selectedProducts,
        inventory: 'd07e8795-3d6d-4d1e-b810-39f23933dc35',
        fetchSales,
        fetchInventoryProducts: fetchProducts
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

  const filteredProducts = products
    .filter((detail) => detail.quantity > 0)
    .filter(
      (detail) =>
        detail.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detail.product.commercial_id
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) // Filter by name or commercial ID
    )

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger className="h-8 gap-1">
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Criar Nova Venda
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1200px] sm:max-h-[720px] sm:min-w-[1000px] sm:min-h-[600px] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Criar Nova Venda</DialogTitle>
          <DialogDescription>
            Insira as informações necessárias para criar a venda.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 items-center">
          <Label htmlFor="text">Método de Pagamento</Label>
          <Select
            onValueChange={(value) => setPaymentMethod(value)}
            required={true}
          >
            <SelectTrigger className="w-[260px]">
              <SelectValue placeholder="Selecione forma de pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Formas de pagamentos</SelectLabel>
                <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                <SelectItem value="PIX">PIX</SelectItem>
                <SelectItem value="Cartão de Crédito">
                  Cartão de Crédito
                </SelectItem>
                <SelectItem value="Cartão de Débito">
                  Cartão de Débito
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4">
          <Card className="col-span-3 h-[360px] overflow-scroll">
            <CardHeader>
              <div className="flex items-center">
                <CardDescription>Lista de Produtos no Estoque</CardDescription>
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
                    <TableHead className="hidden md:table-cell text-center">
                      Quantidade
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((detail) => (
                    <ProductTableRow
                      key={detail.product.commercial_id}
                      productData={detail.product}
                      quantity={detail.quantity}
                      isInSalePostDialog={true}
                      SaleDialogFunc={() => handleAddProduct(detail.product)}
                    />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="ml-4 max-h-[360px] overflow-scroll">
            <CardHeader>
              <CardDescription>Listagem da Venda</CardDescription>
            </CardHeader>
            <CardContent>
              <ul>
                {selectedProducts.map((selectedProduct) => (
                  <li className="mb-2" key={selectedProduct.product_id}>
                    <SupplyCard
                      key={selectedProduct.product_id}
                      product={
                        products.find(
                          (detail) =>
                            detail.product.id === selectedProduct.product_id
                        )?.product
                      }
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
          {paymentMethod === '' ? (
            <Button disabled={true} type="submit">
              Criar
            </Button>
          ) : (
            <DialogClose>
              <Button onClick={handleClick} type="submit">
                Criar
              </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
