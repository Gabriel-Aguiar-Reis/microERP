import { ProductDetails } from '@/components/blocks/sales'

export default function SaleProductCardRow({
  productData
}: {
  productData: ProductDetails
}) {
  function getTotalSalePrice() {
    let totalSalePrice = 0
    let productTotal = productData.product.sell_price * productData.quantity
    totalSalePrice += productTotal
    return totalSalePrice.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL'
    })
  }
  return (
    <li className="flex items-center justify-between">
      <span className="text-muted-foreground">
        {`[${productData.product.commercial_id}] `}
        {productData.product.name} x <span>{productData.quantity}</span>
      </span>
      <span>{getTotalSalePrice()}</span>
    </li>
  )
}
