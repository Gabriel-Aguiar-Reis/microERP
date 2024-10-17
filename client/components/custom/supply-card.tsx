import { Minus, Plus } from 'lucide-react'
import { Product } from '@/components/blocks/products'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SupplyProduct } from '@/components/blocks/supplies'

export default function SupplyCard({
  product,
  quantity,
  handleAddQty,
  handleSubQty,
  selectedProduct
}: {
  product?: Product
  quantity?: number
  handleAddQty: (selectedProduct: SupplyProduct) => void
  handleSubQty: (selectedProduct: SupplyProduct) => void
  selectedProduct: SupplyProduct
}) {
  return (
    product && (
      <Card>
        <CardContent>
          <div className="flex justify-between items-center m-auto pt-6">
            <span>{product.commercial_id}</span>
            <Button
              size="sm"
              variant="outline"
              className="h-4 w-10 gap-1 text-sm items-center"
              onClick={() => handleSubQty(selectedProduct)}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span>{quantity}</span>
            <Button
              size="sm"
              variant="outline"
              className="h-4 w-10 gap-1 text-sm items-center"
              onClick={() => handleAddQty(selectedProduct)}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  )
}
