import { Badge } from '@/components/ui/badge'
import { TableRow, TableCell } from '@/components/ui/table'

interface ProductDetails {
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
}

function formatDate(sale_date: string): string {
  const date = new Date(sale_date)
  return date.toLocaleDateString('pt-BR')
}

function getTotalSalePrice(mapedSale: Sale) {
  let totalSalePrice = 0
  mapedSale.products_details.map((detail) => {
    let productTotal = detail.product.sell_price * detail.quantity
    totalSalePrice += productTotal
  })
  return totalSalePrice.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL'
  })
}

function getTotalCostPrice(mapedSale: Sale) {
  let totalCostPrice = 0
  mapedSale.products_details.map((detail) => {
    let productTotal = detail.product.cost_price * detail.quantity
    totalCostPrice += productTotal
  })
  return totalCostPrice.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL'
  })
}

function getProductsQty(mapedSale: Sale) {
  let totalProductQty = 0
  mapedSale.products_details.map((detail) => {
    let productQty = detail.quantity
    totalProductQty += productQty
  })
  return totalProductQty
}

export default function SaleTableRow(mapedSale: Sale) {
  return (
    <TableRow className="bg-accent">
      <TableCell>
        <Badge className="text-xs" variant="secondary">
          {mapedSale.id}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {formatDate(mapedSale.sale_date)}
      </TableCell>
      <TableCell className="text-center">{getProductsQty(mapedSale)}</TableCell>
      <TableCell className="text-center text-red-500">
        {getTotalCostPrice(mapedSale)}
      </TableCell>
      <TableCell className="text-right text-green-500">
        {getTotalSalePrice(mapedSale)}
      </TableCell>
    </TableRow>
  )
}
