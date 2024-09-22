'use client'
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Expand,
  File,
  ListFilter,
  Plus,
  User
} from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import SellersTableRow from '@/components/custom/sellers-table-row'
import { useEffect, useState } from 'react'
import { getUsers } from '@/lib/api'
import CreateUserDialog from '@/components/custom/create-user-dialog'
import AsideBar from '@/components/custom/aside-bar'
import Header from '@/components/custom/header'
import EditUserDialog from '@/components/custom/edit-user-dialog'
import DeleteUserDialog from '@/components/custom/delete-user-dialog'

export interface User {
  id: string
  first_name: string
  last_name: string
  initials: string
  fullName: string
  email: string
  isStaff: boolean
  username: string
}

export function Sellers() {
  const [errorResponse, setErrorResponse] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [counter, setCounter] = useState(0)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const fetchUsers = async () => {
    try {
      const usersData = await getUsers()
      setUsers(usersData)
    } catch (e) {
      setErrorResponse(true)
    }
  }
  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    setCounter(users.length)
  }, [users])

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 bg-muted/40">
      <AsideBar section="Sellers" />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header breadcrumbName="Vendedores" />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="fixed top-100 bottom-4 right-4">
            <Button
              size="icon"
              className="sm:hidden overflow-hidden rounded-full"
            >
              <Plus color="white" className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Tabs defaultValue="all">
              <div className="flex items-center">
                <div className="ml-auto flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Filtrar</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem checked>
                        Active
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Archived
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 text-sm"
                  >
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Exportar</span>
                  </Button>
                  <div className="max-sm:hidden">
                    <CreateUserDialog fetchUsers={fetchUsers} />
                  </div>
                </div>
              </div>
              <TabsContent value="all">
                <Card x-chunk="dashboard-06-chunk-0">
                  <CardHeader>
                    <CardTitle>Vendedores</CardTitle>
                    <CardDescription>
                      Vendedores associados ao estoque.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="hidden sm:table-cell w-16">
                            Avatar
                          </TableHead>
                          <TableHead>Usuário</TableHead>
                          <TableHead>Cargo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <SellersTableRow
                            func={() => setSelectedUser(user)}
                            key={user.email}
                            initials={user.initials}
                            fullName={user.fullName}
                            email={user.email}
                            isStaff={user.isStaff}
                            username={user.username}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <div className="text-xs text-muted-foreground">
                      Mostrando <strong>1-10</strong> de{' '}
                      <strong>{counter}</strong> vendedores
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            {selectedUser && (
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row justify-between items-start bg-muted/50">
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                      {selectedUser.fullName}
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Copy className="h-3 w-3" />
                        <span className="sr-only">Copiar nome de usuário</span>
                      </Button>
                    </CardTitle>
                    <CardDescription>{selectedUser.email}</CardDescription>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-auto flex items-center gap-2">
                      <DeleteUserDialog
                        selectedUser={selectedUser}
                        fetchUsers={fetchUsers}
                      />
                      <EditUserDialog
                        selectedUser={selectedUser}
                        fetchUsers={fetchUsers}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                  <div>
                    <ul className="grid gap-3">
                      <li>
                        <span className="font-semibold">Avatar</span>
                      </li>
                      <li className="flex justify-center">
                        <Avatar className="m-2 hidden h-24 w-24 sm:flex">
                          <AvatarFallback>
                            {selectedUser.initials}
                          </AvatarFallback>
                        </Avatar>
                      </li>
                      <Separator className="my-2" />
                      <div className="flex justify-between">
                        <div>
                          <li>
                            <span className="font-semibold">Nome</span>
                          </li>
                          <li>
                            <span>{selectedUser.first_name}</span>
                          </li>
                        </div>
                        <div>
                          <li>
                            <span className="font-semibold">Sobrenome</span>
                          </li>
                          <li>
                            <span>{selectedUser.last_name}</span>
                          </li>
                        </div>
                        <div>
                          <li>
                            <span className="font-semibold">Usuário</span>
                          </li>
                          <li>
                            <span>{selectedUser.username}</span>
                          </li>
                        </div>
                      </div>
                      <Separator className="my-2" />
                      <li>
                        <span className="font-semibold">Cargo</span>
                      </li>
                      <li>
                        <div className="p-2 text-sm">
                          <Badge variant="secondary">Vendedor</Badge>
                          <Badge variant="secondary" className="ml-2">
                            {selectedUser.isStaff && 'Administrador'}
                          </Badge>
                        </div>
                      </li>
                      <Separator className="my-2" />
                      <li>
                        <div className="flex items-center">
                          <span className="font-semibold">Vendas</span>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="ml-2 h-6 w-6"
                          >
                            <Expand className="h-4 w-4" />
                            <span className="sr-only">Visualizar vendas</span>
                          </Button>
                        </div>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
