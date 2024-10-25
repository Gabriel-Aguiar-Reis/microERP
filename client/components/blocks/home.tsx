'use client'
import {
  CircleDollarSign,
  ChartNoAxesCombined,
  CreditCard,
  DollarSign,
  Package,
  Truck
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AsideBar from '@/components/custom/aside-bar'
import Header from '@/components/custom/header'
import { useEffect, useState } from 'react'
import { ProductDetails, Sale } from '@/components/blocks/sales'
import {
  getInventoryProducts,
  getSales,
  getSupplies,
  getUsers
} from '@/lib/api'
import { User } from '@/components/blocks/sellers'
import { Supply } from '@/components/blocks/supplies'
import { Product } from '@/components/blocks/products'

export function HomePage() {
  const [products, setProducts] = useState<ProductDetails[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [supplies, setSupplies] = useState<Supply[]>([])

  const getTotalCost = () => {
    let totalCost = supplies.reduce((total, supply) => {
      return (
        total +
        supply.products_details.reduce((subtotal, item) => {
          if (item.product) {
            return subtotal + item.product.cost_price * item.quantity
          }
          return subtotal
        }, 0)
      )
    }, 0)
    return totalCost.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const getTotalSell = () => {
    let totalSell = sales.reduce((total, sale) => {
      return (
        total +
        sale.products_details.reduce((subtotal, item) => {
          if (item.product) {
            return subtotal + item.product.sell_price * item.quantity
          }
          return subtotal
        }, 0)
      )
    }, 0)
    return totalSell
  }

  const getSalesQty = () => {
    return sales.length
  }

  const getSaleAverage = () => {
    return getTotalSell() / getSalesQty()
  }

  const greatestSellerBySalesNumber = () => {
    if (users.length === 0) {
      return null
    }

    let greatestSeller: User = users[0]
    let maxSales = 0

    users.forEach((user) => {
      const userSalesCount = user.sales.length

      if (userSalesCount > maxSales) {
        maxSales = userSalesCount
        greatestSeller = user
      }
    })
    return greatestSeller
  }

  const greatesSellerBySalesAmount = () => {
    if (users.length === 0) {
      return null
    }

    let greatestSeller: User = users[0]
    let maxAmount = 0

    users.forEach((user) => {
      let salesAmount = 0
      user.sales.forEach((sale) => {
        sale.products_details.forEach((detail) => {
          salesAmount += detail.quantity * detail.product.sell_price
        })
      })
      if (salesAmount > maxAmount) {
        maxAmount = salesAmount
        greatestSeller = user
      }
    })
    return { greatestSeller, maxAmount }
  }

  const getSuppliesQty = () => {
    return supplies.length
  }

  const getMostSelledProduct = (): {
    product: Product | null
    quantity: number
  } => {
    const productQuantities = new Map<
      string,
      { product: Product; totalQuantity: number }
    >()

    sales.forEach((sale) => {
      sale.products_details.forEach((detail) => {
        const productId = detail.product.id
        const productQty = detail.quantity

        if (productQuantities.has(productId)) {
          // Se o produto já estiver no Map, atualiza a quantidade
          productQuantities.get(productId)!.totalQuantity += productQty
        } else {
          // Se for a primeira vez que vemos o produto, adicionamos ao Map
          productQuantities.set(productId, {
            product: detail.product,
            totalQuantity: productQty
          })
        }
      })
    })

    let bestSellingProduct: Product | null = null
    let mostUnits = 0

    // Itera sobre o Map para encontrar o produto com mais unidades vendidas
    productQuantities.forEach(({ product, totalQuantity }) => {
      if (totalQuantity > mostUnits) {
        mostUnits = totalQuantity
        bestSellingProduct = product
      }
    })

    return { product: bestSellingProduct, quantity: mostUnits }
  }

  const getTotalAmountByPaymentMethod = (method: string): number => {
    return sales.reduce((totalAmount, sale) => {
      if (sale.payment_method === method) {
        const saleTotal = sale.products_details.reduce((sum, detail) => {
          return sum + detail.quantity * detail.product.sell_price
        }, 0)
        return totalAmount + saleTotal
      }
      return totalAmount
    }, 0)
  }

  const fetchUsers = async () => {
    try {
      const response = await getUsers()
      setUsers(response)
    } catch (e) {}
  }
  const fetchSales = async () => {
    try {
      const response = await getSales()
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()

      const filteredSales = response.filter((sale: Sale) => {
        const saleDate = new Date(sale.sale_date)
        return (
          saleDate.getMonth() === currentMonth &&
          saleDate.getFullYear() === currentYear
        )
      })

      setSales(filteredSales)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await getInventoryProducts({
        inventoryId: 'd07e8795-3d6d-4d1e-b810-39f23933dc35'
      })
      setProducts(response)
    } catch (e) {}
  }

  const fetchSupplies = async () => {
    try {
      const response = await getSupplies()
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()

      const filteredSupplies = response.filter((supply: Supply) => {
        const supplyDate = new Date(supply.supply_date) // Supondo que exista um campo supply_date
        return (
          supplyDate.getMonth() === currentMonth &&
          supplyDate.getFullYear() === currentYear
        )
      })

      setSupplies(filteredSupplies)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchSales()
    fetchProducts()
    fetchSupplies()
  }, [])
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 bg-muted/40">
      <AsideBar section="Home" />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mx-auto">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Custos</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  - {getTotalCost()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Faturamento
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  +{' '}
                  {getTotalSell().toLocaleString('pt-br', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+ {getSalesQty()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Média vendas
                </CardTitle>
                <ChartNoAxesCombined className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  +{' '}
                  {getSaleAverage().toLocaleString('pt-br', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Mais vendas
                </CardTitle>
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">
                  {greatestSellerBySalesNumber()?.fullName}
                </div>
                <p className="text-xs text-muted-foreground">
                  {greatestSellerBySalesNumber()?.sales.length} vendas
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Maior montante
                </CardTitle>
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">
                  {greatesSellerBySalesAmount()?.greatestSeller.fullName}
                </div>
                <p className="text-xs text-muted-foreground text-green-500">
                  +{' '}
                  {greatesSellerBySalesAmount()?.maxAmount.toLocaleString(
                    'pt-br',
                    {
                      style: 'currency',
                      currency: 'BRL'
                    }
                  )}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Fornecimentos
                </CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+ {getSuppliesQty()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Mais vendido
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl">
                  {getMostSelledProduct().product?.commercial_id}
                </div>
                <p className="text-xs text-muted-foreground">
                  {getMostSelledProduct().quantity} unidades
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Valor vendido
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{' '}
                  {getTotalAmountByPaymentMethod('Dinheiro').toLocaleString(
                    'pt-br',
                    {
                      style: 'currency',
                      currency: 'BRL'
                    }
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Dinheiro</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Valor vendido
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{' '}
                  {getTotalAmountByPaymentMethod(
                    'Cartão de Crédito'
                  ).toLocaleString('pt-br', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Cartão de Crédito
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Valor vendido
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{' '}
                  {getTotalAmountByPaymentMethod(
                    'Cartão de Débito'
                  ).toLocaleString('pt-br', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Cartão de Débito
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Valor vendido
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{' '}
                  {getTotalAmountByPaymentMethod('PIX').toLocaleString(
                    'pt-br',
                    {
                      style: 'currency',
                      currency: 'BRL'
                    }
                  )}
                </div>
                <p className="text-xs text-muted-foreground">PIX</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
