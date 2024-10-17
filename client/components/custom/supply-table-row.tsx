import { Supply } from '@/components/blocks/supplies'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { deleteSupply } from '@/lib/api'
import { Expand, Trash2 } from 'lucide-react'

export default function SupplyTableRow({
  supply,
  fetchSupplies
}: {
  supply: Supply
  fetchSupplies: () => Promise<void>
}) {
  const formattedDate = new Date(supply.supply_date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  const handleClick: () => Promise<void> = async () => {
    try {
      const supplyId = supply.id
      await deleteSupply({ supplyId, fetchSupplies })
    } catch (e) {
      return Promise.reject(e)
    }
  }
  console.log(supply)
  function getTotalCostPrice() {
    let totalCostPrice = 0
    supply.products_details.map(
      (productInfo) =>
        (totalCostPrice +=
          productInfo.product.cost_price * productInfo.quantity)
    )
    return totalCostPrice.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  return (
    <TableRow>
      <TableCell>
        <Badge className="text-xs" variant="secondary">
          {supply.commercial_id}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{formattedDate}</TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1 text-sm items-center"
          >
            <Expand className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Visualizar</span>
          </Button>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {getTotalCostPrice()}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1 text-sm items-center"
            onClick={handleClick}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Deletar</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
