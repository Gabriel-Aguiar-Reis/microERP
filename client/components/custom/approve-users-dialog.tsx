import { UserCheck } from 'lucide-react'
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
import SellersTableRow from '@/components/custom/sellers-table-row'
interface ApproveUsersDialogProps {
  users: User[]
  inventoryId: string
  fetchUsers: () => Promise<void>
}
export default function ApproveUsersDialog({
  users,
  inventoryId,
  fetchUsers
}: ApproveUsersDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-1 text-sm">
          <UserCheck className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only">Aprovar Usuários</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[960px] max-h-[580px] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Aprovar Usuários</DialogTitle>
          <DialogDescription>
            Aprove usuários criados para fazerem parte do seu estoque.
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(
              (user) =>
                !user.work_on && (
                  <SellersTableRow
                    key={user.email}
                    inventoryId={inventoryId}
                    isApproveDialog={true}
                    initials={user.initials}
                    fullName={user.fullName}
                    email={user.email}
                    isStaff={user.isStaff}
                    username={user.username}
                    id={user.id}
                    funcPromise={fetchUsers}
                  />
                )
            )}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}
