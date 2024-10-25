'use client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import AsideBar from '@/components/custom/aside-bar'
import Header from '@/components/custom/header'
import { useEffect, useState } from 'react'
import { getUsers, patchInventory, patchUser } from '@/lib/api'
import { User } from '@/components/blocks/sellers'

export function SettingsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const validatePassword = (password: string) =>
    /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$/.test(
      password
    )
  const handleBlurPassword = () => {
    if (!validatePassword(password)) {
      setPasswordError(
        'A senha deve ter de 8 a 32 caracteres, conter pelo menos um número, uma letra maiúscula, uma letra minúscula e um caractere especial.'
      )
    } else {
      setPasswordError('')
    }
  }
  const changeInventoryName: () => Promise<void> = async () => {
    try {
      await patchInventory({ id: 'd07e8795-3d6d-4d1e-b810-39f23933dc35', name })
    } catch (e) {
      return Promise.reject(e)
    }
  }

  const changePassword: () => Promise<void> = async () => {
    const user = users.find(
      (user) => user.username === localStorage.getItem('username')
    )
    try {
      if (user) {
        await patchUser({ id: user.id, password })
      }
    } catch (e) {
      return Promise.reject(e)
    }
  }
  const fetchUsers = async () => {
    const response = await getUsers()
    setUsers(response)
  }
  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 bg-muted/40">
      <AsideBar section="Settings" />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header breadcrumbName="Configurações" />
        <main className="flex gap-4 bg-muted/40 p-4 md:gap-8 md:px-10 py-4">
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6">
            <div className="grid grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Nome do Estoque</CardTitle>
                  <CardDescription>
                    Usado para identificar facilmente seu próprio estoque.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form>
                    <Input
                      placeholder="Nome do estoque"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </form>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button onClick={changeInventoryName}>Salvar</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Senha do Usuário</CardTitle>
                  <CardDescription>
                    Senha utilizada para fazer login neste usuário.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form>
                    <Input
                      placeholder="Senha de usuário"
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={handleBlurPassword}
                    />
                  </form>
                  {passwordError && (
                    <div className="text-red-500 text-sm p-2 bg-red-100 rounded-md mt-2">
                      <p>{passwordError}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button onClick={changePassword}>Salvar</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
