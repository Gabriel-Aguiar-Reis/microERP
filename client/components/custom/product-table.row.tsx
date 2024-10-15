import { Product } from '@/components/blocks/products'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'

export default function ProductTableRow({
  productData,
  func
}: {
  productData: Product
  func: () => void
}) {
  return (
    <TableRow onClick={func}>
      <TableCell className="hidden sm:table-cell">
        <div className="bg-slate-200 rounded-lg h-16 w-16"></div>
      </TableCell>
      <TableCell>
        <Badge className="text-xs" variant="secondary">
          {productData.commercial_id}
        </Badge>
      </TableCell>
      <TableCell>{productData.name}</TableCell>
      <TableCell className="text-center">
        {productData.cost_price.toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL'
        })}
      </TableCell>
      <TableCell className="text-center">
        {productData.sell_price.toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL'
        })}
      </TableCell>
    </TableRow>
  )
}
