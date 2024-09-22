import { PencilRuler } from 'lucide-react'
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
import { User } from '@/components/blocks/sellers'
import { Checkbox } from '@/components/ui/checkbox'
import { patchUser } from '@/lib/api'
import { useState, useEffect } from 'react'

interface EditUserDialogProps {
  selectedUser: User
  fetchUsers: () => Promise<void>
}

export default function EditUserDialog({
  selectedUser,
  fetchUsers
}: EditUserDialogProps) {
  const [username, setUsername] = useState('')
  const [isStaff, setIsStaff] = useState(selectedUser.isStaff)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [errorResponse, setErrorResponse] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Error states
  const [firstNameError, setFirstNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [formError, setFormError] = useState('')

  // Update the state when selectedUser changes
  useEffect(() => {
    setUsername(selectedUser.username)
    setFirstName(selectedUser.first_name)
    setLastName(selectedUser.last_name)
    setEmail(selectedUser.email)
    setIsStaff(selectedUser.isStaff)
  }, [selectedUser])

  // Validation functions
  const validateName = (name: string) => /^[a-zA-ZÀ-ÿ\s]+$/.test(name)
  const validateUsername = (username: string) =>
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{6,24}$/.test(username)
  const validateEmail = (email: string) =>
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)

  const handleBlurFirstName = () => {
    if (!validateName(firstName)) {
      setFirstNameError(
        'Nome deve conter apenas letras (incluindo acentuadas) e espaços.'
      )
    } else {
      setFirstNameError('')
    }
  }

  const handleBlurUsername = () => {
    if (!validateUsername(username)) {
      setUsernameError(
        'O nome de usuário deve ter de 6 a 24 caracteres, conter pelo menos uma letra maiúscula, uma letra minúscula e um caractere especial.'
      )
    } else {
      setUsernameError('')
    }
  }

  const handleBlurLastName = () => {
    if (!validateName(lastName)) {
      setLastNameError(
        'Sobrenome deve conter apenas letras (incluindo acentuadas) e espaços.'
      )
    } else {
      setLastNameError('')
    }
  }

  const handleBlurEmail = () => {
    if (!validateEmail(email)) {
      setEmailError(
        'O email deve ser um endereço de email válido, como "exemplo@dominio.com".'
      )
    } else {
      setEmailError('')
    }
  }

  async function handleClick() {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !username.trim()
    ) {
      setFormError('Todos os campos são obrigatórios.')
      return
    }

    if (
      firstName === 'Max' ||
      lastName === 'Robinson' ||
      email === 'm@example.com'
    ) {
      setFormError('Os valores não podem ser iguais aos placeholders.')
      return
    }
    const id = selectedUser.id
    try {
      if (!firstNameError && !lastNameError && !emailError && !usernameError) {
        await patchUser({
          id,
          username,
          firstName,
          lastName,
          email,
          isStaff,
          fetchUsers
        })
        setErrorResponse(false)
      }
    } catch (error: any) {
      setErrorResponse(true)
    }
  }

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
          <DialogTitle>Editar Vendedor</DialogTitle>
          <DialogDescription>
            Faça as alterações do vendedor aqui. Clique em Salvar quando quiser
            finalizar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4">
            <ul>
              <li>
                <Label htmlFor="username" className="text-right">
                  Nome de Usuário
                </Label>
              </li>
              <li>
                <Input
                  id="commercial-id"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={handleBlurUsername}
                  required
                  className="col-span-1"
                />
              </li>
              {usernameError && (
                <div className="text-red-500 text-sm p-2 bg-red-100 rounded-md">
                  <p>{usernameError}</p>
                </div>
              )}
            </ul>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <ul>
              <li>
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
              </li>
              <li>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleBlurEmail}
                  required
                  className="col-span-3"
                />
              </li>
              {emailError && (
                <div className="text-red-500 text-sm p-2 bg-red-100 rounded-md">
                  <p>{emailError}</p>
                </div>
              )}
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
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={handleBlurFirstName}
                  required
                  className="col-span-3"
                />
              </li>
              {firstNameError && (
                <div className="text-red-500 text-sm p-2 bg-red-100 rounded-md">
                  <p>{firstNameError}</p>
                </div>
              )}
            </ul>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <ul>
              <li>
                <Label htmlFor="name" className="text-right">
                  Sobrenome
                </Label>
              </li>
              <li>
                <Input
                  id="name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={handleBlurLastName}
                  required
                  className="col-span-3"
                />
              </li>
              {lastNameError && (
                <div className="text-red-500 text-sm p-2 bg-red-100 rounded-md">
                  <p>{lastNameError}</p>
                </div>
              )}
            </ul>
          </div>
          <ul>
            <li>
              <Label htmlFor="name" className="text-right">
                Cargos
              </Label>
            </li>
            <div className="grid grid-cols-2 gap-4">
              <li>
                <div className="flex items-center mt-2">
                  <Checkbox
                    id="sellerCheck"
                    className="col-span-3"
                    checked={true}
                    disabled={true}
                  />
                  <Label htmlFor="terms" className="text-right ml-2">
                    Vendedor
                  </Label>
                </div>
              </li>
              <li>
                <div className="flex items-center mt-2">
                  <Checkbox
                    id="adminCheck"
                    className="col-span-3"
                    checked={isStaff} // Bind the state
                    onClick={() => setIsStaff((prev) => !prev)} // Toggle the state
                  />
                  <Label htmlFor="terms" className="text-right ml-2">
                    Administrador
                  </Label>
                </div>
              </li>
            </div>
          </ul>
        </div>
        <DialogFooter>
          {!firstNameError &&
            !lastNameError &&
            !emailError &&
            !usernameError && (
              <DialogClose>
                <Button type="submit" onClick={handleClick}>
                  Salvar
                </Button>
              </DialogClose>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
