import { Expand } from 'lucide-react'
import { User } from '@/components/blocks/sellers'
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
import { getUser } from '@/lib/api'
import { useState } from 'react'
import SaleTableRow, { Sale } from '@/components/custom/sale-table-row'
import { toast } from 'sonner'
interface UserSellingsDialog {
  selectedUser: User
}
export default function UserSellingsDialog({
  selectedUser
}: UserSellingsDialog) {
  const [sales, setSales] = useState<Sale[]>([])
  async function handleClick() {
    try {
      const response = await getUser(selectedUser)
      setSales(response.data.sales)
      if (!response.data.sales[0]) {
        toast.warning('Usuário não possui vendas!', {
          description: `Não há vendas registradas pelo usuário ${selectedUser.fullName}.`
        })
        return Promise.reject()
      }
      return response
    } catch (e) {
      console.log('erro ', e)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="ml-2 h-6 w-6"
          onClick={handleClick}
        >
          <Expand className="h-4 w-4" />
          <span className="sr-only">Visualizar vendas</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[960px]">
        <DialogHeader>
          <DialogTitle>Vendas</DialogTitle>
          <DialogDescription>
            Vendas associadas ao usuário {selectedUser.fullName}
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead className="hidden md:table-cell">Data</TableHead>
              <TableHead className="text-center">Qte. de Produtos</TableHead>
              <TableHead className="text-center">Custo</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale: Sale) => (
              <SaleTableRow key={sale.id} {...sale} />
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}
