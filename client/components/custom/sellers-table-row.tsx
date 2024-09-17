import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'

interface SellersTableRowProps {
  initials: string
  fullName: string
  email: string
  isStaff: boolean
  func: () => void
}

export default function SellersTableRow({
  initials,
  fullName,
  email,
  isStaff,
  func
}: SellersTableRowProps) {
  return (
    <TableRow onClick={func}>
      <TableCell className="hidden sm:table-cell">
        <Avatar className="hidden h-12 w-12 sm:flex">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell>
        <div className="grid gap-1">
          <p className="text-sm font-medium leading-none">{fullName}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </TableCell>
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
    </TableRow>
  )
}
