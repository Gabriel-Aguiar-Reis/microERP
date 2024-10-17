import { Product } from '@/components/blocks/products'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { PlusCircle } from 'lucide-react'

export default function ProductTableRow({
  productData,
  func,
  isInSupplyPostDialog,
  isSupplyProductsViewDialog,
  SupplyDialogFunc,
  quantity
}: {
  productData: Product
  func?: () => void
  isInSupplyPostDialog?: boolean
  isSupplyProductsViewDialog?: boolean
  SupplyDialogFunc?: () => void
  quantity?: number
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
      <TableCell className="text-center">
        {isSupplyProductsViewDialog && <span>{quantity}</span>}
      </TableCell>
      {isInSupplyPostDialog && (
        <TableCell className="text-center">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1 text-sm items-center"
            onClick={SupplyDialogFunc}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Adicionar</span>
          </Button>
        </TableCell>
      )}
    </TableRow>
  )
}
