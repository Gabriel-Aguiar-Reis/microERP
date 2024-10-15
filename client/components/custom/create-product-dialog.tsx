import { PlusCircle } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { postProduct } from '@/lib/api'
export default function CreateProductDialog({
  fetchProducts
}: {
  fetchProducts: () => Promise<void>
}) {
  const [commercialId, setCommercialId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [costPrice, setCostPrice] = useState(0)
  const [sellPrice, setSellPrice] = useState(0)
  const handleClick = async () => {
    try {
      await postProduct({
        commercialId,
        name,
        description,
        costPrice,
        sellPrice,
        fetchProducts
      })
    } catch (e) {
      return Promise.reject(e)
    }
  }
  return (
    <div>
      <Dialog>
        <DialogTrigger className="h-8 gap-1">
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Criar Novo Produto
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] sm:max-h-[640px] overflow-scroll">
          <DialogHeader>
            <DialogTitle>Criar Novo Produto</DialogTitle>
            <DialogDescription>
              Insira as informações necessárias para criar o produto.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 overflow-y-auto">
            <div className="grid grid-cols-1 gap-4">
              <ul>
                <li>
                  <Label htmlFor="text" className="text-right">
                    Código do Produto
                  </Label>
                </li>
                <li>
                  <Input
                    id="commercial-id"
                    onChange={(e) => setCommercialId(e.target.value)}
                    className="col-span-1"
                  />
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <ul>
                <li>
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                </li>
                <li>
                  <Input
                    id="name"
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                  />
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-between gap-4">
                <ul>
                  <li>
                    <Label htmlFor="number" className="text-right">
                      Preço de Compra
                    </Label>
                  </li>
                  <li>
                    <Input
                      id="sell-price"
                      type="number"
                      onChange={(e) => setCostPrice(e.target.valueAsNumber)}
                      min="0"
                      className="col-span-2"
                    />
                  </li>
                </ul>
              </div>
              <div className="flex justify-between gap-4">
                <ul>
                  <li>
                    <Label htmlFor="number" className="text-right">
                      Preço de Venda
                    </Label>
                  </li>
                  <li>
                    <Input
                      id="sell-price"
                      type="number"
                      onChange={(e) => setSellPrice(e.target.valueAsNumber)}
                      min="0"
                      className="col-span-2"
                    />
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <ul>
                <li>
                  <Label htmlFor="picture">Imagem</Label>
                </li>
                <li>
                  <Input
                    id="picture"
                    type="file"
                    name="foto do produto"
                    className="col-span-3"
                    accept="image/png, image/jpeg"
                  />
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <ul>
                <li>
                  <Label htmlFor="description">Descrição</Label>
                </li>
                <li>
                  <Textarea
                    id="description"
                    onChange={(e) => setDescription(e.target.value)}
                    className="col-span-3"
                  />
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button onClick={handleClick} type="submit">
                Criar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
