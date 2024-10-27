'use client'
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
import ProductTableRow from '@/components/custom/product-table-row'
import { Product } from '@/components/blocks/products'
import { useEffect, useState } from 'react'
import {
  getInventoryProducts,
  getProducts,
  getUsers,
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

export default function SaleForm() {
  const [paymentMethod, setPaymentMethod] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<SupplyProduct[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<ProductDetails[]>([])
  const [users, setUsers] = useState<User[]>([])

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
        users
      })
    } catch (e) {
      return Promise.reject(e)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await getUsers()
      setUsers(response.data)
    } catch (e) {
      console.error(e)
    }
  }
  const fetchInventoryProducts: () => Promise<void> = async () => {
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

  const filteredProducts = products
    .filter((detail) => detail.quantity > 0)
    .filter(
      (detail) =>
        detail.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detail.product.commercial_id
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) // Filter by name or commercial ID
    )

  useEffect(() => {
    fetchInventoryProducts()
    fetchUsers()
  }, [])

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="pl-4 pr-4">
        <CardHeader>
          <CardTitle>Criar Nova Venda</CardTitle>
          <CardDescription>
            Insira as informações necessárias para criar a venda.
          </CardDescription>
        </CardHeader>
        <div className="flex gap-2 items-center pb-4">
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
        <CardFooter className="pt-4">
          {paymentMethod === '' ? (
            <Button disabled={true} type="submit">
              Criar
            </Button>
          ) : (
            <Button onClick={handleClick} type="submit">
              Criar
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
