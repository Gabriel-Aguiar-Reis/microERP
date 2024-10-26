'use client'
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Expand,
  File,
  ListFilter,
  Plus,
  Search,
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
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem
} from '@/components/ui/pagination'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import SellerTableRow from '@/components/custom/seller-table-row'
import { useEffect, useState } from 'react'
import { getUsers } from '@/lib/api'
import CreateUserDialog from '@/components/custom/create-user-dialog'
import AsideBar from '@/components/custom/aside-bar'
import Header from '@/components/custom/header'
import EditUserDialog from '@/components/custom/edit-user-dialog'
import DeleteUserDialog from '@/components/custom/delete-user-dialog'
import UserSellingsDialog from '@/components/custom/user-sellings-dialog'
import ApproveUsersDialog from '@/components/custom/approve-users-dialog'
import { Sale } from '@/components/blocks/sales'

import { utils, writeFile } from 'xlsx'
import { v4 as uuidv4 } from 'uuid'
export interface User {
  id: string
  first_name: string
  last_name: string
  initials: string
  fullName: string
  email: string
  isStaff: boolean
  username: string
  work_on: string
  sales: Sale[]
}

const exportToExcel = (users: User[]) => {
  // Mapeie os dados dos usuários para o formato desejado
  const formattedUsers = users
    .filter((user) => user.work_on)
    .map((user) => ({
      Nome: user.fullName,
      Email: user.email,
      Cargo: user.isStaff ? 'Administrador e Vendedor' : 'Vendedor',
      NumVendas: user.sales.length
    }))

  // Crie uma nova planilha a partir dos dados formatados
  const ws = utils.json_to_sheet(formattedUsers)
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Vendedores')

  // Obtenha a data atual no formato ddMMyyyy
  const currentDate = new Date().toLocaleDateString('pt-BR').replace(/\//g, '')

  // Gera um UUID para o nome do arquivo
  const uuid = uuidv4()

  // Cria o nome do arquivo no formato ddMMyyyy-vendedores-uuidv4.xlsx
  const fileName = `${currentDate}-vendedores-${uuid}.xlsx`

  // Exporta a planilha com o nome gerado
  writeFile(wb, fileName)
}

export function Sellers() {
  const [errorResponse, setErrorResponse] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [counter, setCounter] = useState(0)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  const fetchUsers: () => Promise<void> = async () => {
    try {
      const usersData = await getUsers()

      // Função de ordenação:
      const sortedUsers = usersData.sort((a: User, b: User) => {
        // Primeiro, verifique se ambos são administradores ou vendedores
        if (a.isStaff && !b.isStaff) return -1 // a é admin, então vem antes
        if (!a.isStaff && b.isStaff) return 1 // b é admin, então a vem depois

        // Se ambos têm o mesmo cargo, ordene pelo nome completo
        return a.fullName.localeCompare(b.fullName)
      })

      setUsers(sortedUsers)
    } catch (e) {
      setErrorResponse(true)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    let userCounter = 0
    users.map((user) => user.work_on && (userCounter += 1))
    setCounter(userCounter)
  }, [users])

  // Filtrar usuários da página atual
  const indexOfLastUser = currentPage * itemsPerPage
  const indexOfFirstUser = indexOfLastUser - itemsPerPage
  const currentUsers = users
    .filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstUser, indexOfLastUser)

  // Navegação de página
  const nextPage = () => {
    if (currentPage < Math.ceil(users.length / itemsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1)
    }
  }
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
                <ApproveUsersDialog
                  users={users}
                  inventoryId={'d07e8795-3d6d-4d1e-b810-39f23933dc35'}
                  fetchUsers={fetchUsers}
                />
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 text-sm"
                    onClick={() => exportToExcel(users)}
                  >
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Exportar</span>
                  </Button>
                  <div className="max-sm:hidden">
                    <CreateUserDialog fetchUsers={fetchUsers} />
                  </div>
                  <div className="relative ml-auto flex-1 md:grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground translate-y-0.5" />
                    <Input
                      type="search"
                      placeholder="Pesquisar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                    />
                  </div>
                </div>
              </div>
              <TabsContent value="all">
                <Card>
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
                          <TableHead className="text-center">Vendas</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentUsers.map(
                          (user) =>
                            user.work_on && (
                              <SellerTableRow
                                func={() => setSelectedUser(user)}
                                key={user.email}
                                initials={user.initials}
                                fullName={user.fullName}
                                email={user.email}
                                isStaff={user.isStaff}
                                username={user.username}
                                id={user.id}
                                isApproveDialog={false}
                                sales={user.sales}
                              />
                            )
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <div className="text-xs text-muted-foreground">
                      Mostrando{' '}
                      <strong>
                        {indexOfFirstUser + 1}-
                        {Math.min(indexOfLastUser, counter)}
                      </strong>{' '}
                      de <strong>{counter}</strong> vendedores
                    </div>
                    <Pagination className="ml-auto mr-0 w-auto">
                      <PaginationContent>
                        <PaginationItem>
                          <Button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                            <span className="sr-only">Anterior</span>
                          </Button>
                        </PaginationItem>
                        <PaginationItem>
                          <Button
                            onClick={nextPage}
                            disabled={
                              currentPage === Math.ceil(counter / itemsPerPage)
                            }
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                            <span className="sr-only">Próximo</span>
                          </Button>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
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
                          <UserSellingsDialog selectedUser={selectedUser} />
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
