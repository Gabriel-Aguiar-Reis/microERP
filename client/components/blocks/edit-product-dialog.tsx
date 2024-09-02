import { PencilRuler } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function EditProductDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PencilRuler className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Editar
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>
            Faça as alterações do produto aqui. Clique em Salvar quando quiser
            finalizar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-y-auto">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text" className="text-right">
              Código do Produto
            </Label>
            <Input
              id="commercial-id"
              defaultValue="PD01"
              className="col-span-1"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              defaultValue="Nome do Produto"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between gap-4">
              <Label htmlFor="number" className="text-right">
                Preço de Custo
              </Label>
              <Input
                id="cost-price"
                type="number"
                defaultValue="9.99"
                className="col-span-2"
              />
            </div>
            <div className="flex justify-between gap-4">
              <Label htmlFor="number" className="text-right">
                Preço de Venda
              </Label>
              <Input
                id="sell-price"
                type="number"
                defaultValue="19.99"
                className="col-span-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4 overflow-y-auto">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              defaultValue="Descrição do produto."
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
