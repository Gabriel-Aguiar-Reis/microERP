import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog'
import { SignInForm } from '@/components/blocks/signin-form'
interface CreateUserDialogProps {
  fetchUsers: () => Promise<void>
}
export default function CreateUserDialog({
  fetchUsers
}: CreateUserDialogProps) {
  return (
    <div>
      <Dialog>
        <DialogTrigger className="h-8 gap-1">
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Criar Novo Usuário
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] sm:max-h-[640px] overflow-scroll">
          <SignInForm
            fetchUsers={fetchUsers}
            isLoggedCreation={true}
            CreateAccountButton={
              <DialogClose asChild>
                <Button type="submit" className="w-full">
                  Criar uma conta
                </Button>
              </DialogClose>
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
