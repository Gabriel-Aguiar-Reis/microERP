import { Expand } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody
} from '@/components/ui/table'
import { Supply } from '@/components/blocks/supplies'
import ProductTableRow from '@/components/custom/product-table-row'

export default function SupplyProductsDialog({ supply }: { supply: Supply }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
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
      </DialogTrigger>
      <DialogContent className="min-w-[960px] max-h-[600px] overflow-scroll">
        <DialogHeader>
          <DialogTitle>Fornecimento</DialogTitle>
          <DialogDescription>
            Produtos associados ao fornecimento {supply.commercial_id}
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden sm:table-cell">Imagem</TableHead>
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
            {supply.products_details.map((supplyProductInfo) => (
              <ProductTableRow
                key={supplyProductInfo.product_id}
                productData={supplyProductInfo.product}
                isSupplyProductsViewDialog={true}
                quantity={supplyProductInfo.quantity}
              />
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}
