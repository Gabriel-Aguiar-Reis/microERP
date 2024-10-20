import { Sale } from '@/components/blocks/sales'
import { User } from '@/components/blocks/sellers'
import { Badge } from '@/components/ui/badge'
import { TableRow, TableCell } from '@/components/ui/table'
import SaleProductsDialog from '@/components/custom/sale-products-dialog'

export default function SaleTableRow({
  mapedSale,
  users,
  func
}: {
  mapedSale: Sale
  users: User[]
  func: () => void
}) {
  function formatDate(sale_date: string): string {
    const date = new Date(sale_date)
    return date.toLocaleDateString('pt-BR')
  }

  function getTotalSalePrice() {
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

  function getTotalCostPrice() {
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

  function getProductsQty() {
    let totalProductQty = 0
    mapedSale.products_details.map((detail) => {
      let productQty = detail.quantity
      totalProductQty += productQty
    })
    return totalProductQty
  }

  const userInfo: User | undefined = users.find(
    (user) => user.id === mapedSale.seller
  )
  return (
    <TableRow className="bg-accent" onClick={func}>
      <TableCell>
        <Badge className="text-xs text-center" variant="secondary">
          {mapedSale.id}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {userInfo && userInfo.first_name + ' ' + userInfo.last_name}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {formatDate(mapedSale.sale_date)}
      </TableCell>
      <TableCell className="text-center">
        <SaleProductsDialog sale={mapedSale} />
      </TableCell>
      <TableCell className="text-center">{getProductsQty()}</TableCell>
      <TableCell className="text-center text-red-500">
        {getTotalCostPrice()}
      </TableCell>
      <TableCell className="text-right text-green-500">
        {getTotalSalePrice()}
      </TableCell>
    </TableRow>
  )
}
