import { Product } from '@/components/blocks/products'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { PlusCircle } from 'lucide-react'

export default function ProductTableRow({
  productData,
  func,
  isInSupplyPostDialog,
  isInSalePostDialog,
  isSupplyProductsViewDialog,
  SupplyDialogFunc,
  SaleDialogFunc,
  quantity,
  isInInventoryTable
}: {
  productData?: Product
  func?: () => void
  isInSupplyPostDialog?: boolean
  isInSalePostDialog?: boolean
  isSupplyProductsViewDialog?: boolean
  SupplyDialogFunc?: () => void
  SaleDialogFunc?: () => void
  quantity?: number
  isInInventoryTable?: boolean
}) {
  return (
    <TableRow onClick={func}>
      <TableCell className="hidden md:table-cell text-center">
        <div className="bg-slate-200 rounded-lg h-16 w-16"></div>
      </TableCell>
      <TableCell>
        <Badge className="text-xs" variant="secondary">
          {productData?.commercial_id}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell text-center">
        {productData?.name}
      </TableCell>
      <TableCell className="hidden md:table-cell text-center">
        {productData?.cost_price.toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL'
        })}
      </TableCell>
      <TableCell className="hidden md:table-cell text-center">
        {productData?.sell_price.toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL'
        })}
      </TableCell>
      {isSupplyProductsViewDialog && (
        <TableCell className="text-center">
          <span>{quantity}</span>
        </TableCell>
      )}
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
      {isInSalePostDialog && (
        <>
          <TableCell className="text-center">{quantity}</TableCell>
          <TableCell className="text-center">
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1 text-sm items-center"
              onClick={SaleDialogFunc}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Adicionar</span>
            </Button>
          </TableCell>
        </>
      )}
      {isInInventoryTable && (
        <TableCell className="text-center">{quantity}</TableCell>
      )}
    </TableRow>
  )
}
