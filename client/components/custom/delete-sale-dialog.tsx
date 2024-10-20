import { ProductDetails, Sale } from '@/components/blocks/sales'
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
import { deleteSale } from '@/lib/api'

export default function DeleteSaleDialog({
  selectedSale,
  fetchSales,
  fetchProducts
}: {
  selectedSale: Sale
  fetchSales: () => Promise<void>
  fetchProducts: () => Promise<void>
}) {
  const handleClick = async () => {
    try {
      if (selectedSale) {
        await deleteSale({ saleId: selectedSale.id, fetchSales, fetchProducts })
      }
    } catch (e) {
      return Promise.reject(e)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive" className="h-8 gap-1 text-sm">
          <span className="sr-only sm:not-sr-only">Deletar</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Deseja realmente excluir a venda {selectedSale.id}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <div className="flex items-center">
              <div className="ml-auto flex items-center gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-8 gap-1 text-sm"
                  onClick={handleClick}
                >
                  <span className="sr-only sm:not-sr-only">Deletar</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1 text-sm ml-2"
                >
                  <span className="sr-only sm:not-sr-only">Cancelar</span>
                </Button>
              </div>
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
