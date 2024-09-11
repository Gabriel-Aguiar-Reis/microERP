'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { postToken } from '@/lib/api'
import api from '@/lib/axios'

export function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorResponse, setErrorResponse] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/home')
    }
  }, [router])

  async function handleLogin() {
    try {
      localStorage.removeItem('token')
      const response = await postToken(username, password)
      setErrorResponse(false)
      const token = response.data['access']
      localStorage.setItem('token', token)

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      if (api.defaults.headers.common['Authorization'] === `Bearer ${token}`) {
        router.push('/home')
      }
    } catch (error) {
      setErrorResponse(true)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Entrar</CardTitle>
          <CardDescription>Informe as credenciais para entrar.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {errorResponse && (
              <div className="text-red-500 text-sm p-2 bg-red-100 rounded-md">
                <p>As credenciais informadas estão erradas.</p>
              </div>
            )}

            <Button onClick={handleLogin} type="button" className="w-full">
              Login
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Não possui uma conta?{' '}
            <Link href="/signin" className="underline">
              Se cadastrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
