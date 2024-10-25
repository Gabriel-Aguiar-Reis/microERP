import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { patchUser, getInventory } from '@/lib/api'
import { toast } from 'sonner'
import { Sale } from '@/components/blocks/sales'

interface SellersTableRowProps {
  initials?: string
  fullName?: string
  username?: string
  email?: string
  isStaff?: boolean
  func?: () => void
  funcPromise?: () => Promise<void>
  isApproveDialog?: boolean
  id: string
  inventoryId?: string
  sales?: Sale[]
}

export default function SellerTableRow({
  initials,
  fullName,
  username,
  email,
  isStaff,
  func,
  funcPromise,
  isApproveDialog,
  inventoryId,
  id,
  sales
}: SellersTableRowProps) {
  async function handleClick() {
    try {
      if (inventoryId) {
        const inventoryResponse = await getInventory(inventoryId)
        const response = await patchUser({
          id,
          fetchUsers: funcPromise,
          workOn: inventoryResponse.data.id,
          username: username
        })
        return response
      }
    } catch (e) {
      toast.warning('Erro detectado!', {
        description: `Houve erro ao tentar adicionar o usuário ao estoque.`
      })
      return Promise.reject(e)
    }
  }

  return (
    <TableRow onClick={!isApproveDialog ? func : () => {}}>
      <TableCell className="hidden sm:table-cell">
        <Avatar className="hidden h-12 w-12 sm:flex">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell>
        <div className="grid gap-1">
          <p className="text-sm font-medium leading-none">{fullName}</p>
          <p className="text-sm text-muted-foreground">
            {email} - {username}
          </p>
        </div>
      </TableCell>
      {!isApproveDialog && (
        <TableCell>
          <ul>
            <li>
              <Badge variant="secondary">Vendedor</Badge>
            </li>
            {isStaff && (
              <li>
                <Badge variant="secondary" className="mt-1">
                  Administrador
                </Badge>
              </li>
            )}
          </ul>
        </TableCell>
      )}
      {!isApproveDialog && (
        <TableCell className="text-center">
          <span>{sales?.length || 0}</span>
        </TableCell>
      )}
      {isApproveDialog && (
        <TableCell>
          <Button className="h-8 gap-1 text-sm" onClick={handleClick}>
            Aprovar
          </Button>
        </TableCell>
      )}
    </TableRow>
  )
}
