'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
import { postUser } from '@/lib/api'

export function SignInForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [errorResponse, setErrorResponse] = useState(false)
  const router = useRouter()

  // Error states
  const [firstNameError, setFirstNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [emailError, setEmailError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/home')
    }
  }, [router])

  // Validation functions
  const validateName = (name: string) => /^[a-zA-ZÀ-ÿ\s]+$/.test(name) // Allow letters and accents
  const validateEmail = (email: string) =>
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) // Basic email validation

  const handleBlurFirstName = () => {
    if (!validateName(firstName)) {
      setFirstNameError(
        'Nome não pode conter números nem caractéres especiais.'
      )
    } else {
      setFirstNameError('')
    }
  }

  const handleBlurLastName = () => {
    if (!validateName(lastName)) {
      setLastNameError(
        'Sobrenome não pode conter números nem caractéres especiais.'
      )
    } else {
      setLastNameError('')
    }
  }

  const handleBlurEmail = () => {
    if (!validateEmail(email)) {
      setEmailError('Email inválido.')
    } else {
      setEmailError('')
    }
  }

  async function handleSignIn() {
    try {
      if (!firstNameError && !lastNameError && !emailError) {
        await postUser(username, password, firstName, lastName, email)
        setErrorResponse(false)
      }
    } catch (error) {
      setErrorResponse(true)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Cadastrar</CardTitle>
          <CardDescription>
            Insira suas informações para criar uma conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">Nome</Label>
                <Input
                  id="first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={handleBlurFirstName} // Validation onBlur
                  placeholder="Max"
                  required
                />
                {firstNameError && (
                  <div className="text-red-500 text-sm p-2 bg-red-100 rounded-md">
                    <p>{firstNameError}</p>
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Sobrenome</Label>
                <Input
                  id="last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={handleBlurLastName} // Validation onBlur
                  placeholder="Robinson"
                  required
                />
                {lastNameError && (
                  <div className="text-red-500 text-sm p-2 bg-red-100 rounded-md">
                    <p>{lastNameError}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleBlurEmail} // Validation onBlur
                placeholder="m@example.com"
                required
              />
              {emailError && (
                <div className="text-red-500 text-sm p-2 bg-red-100 rounded-md">
                  <p>{emailError}</p>
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Nome de Usuário</Label>
              <Input
                id="username"
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Max_Robinson"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid mt-4">
              <Link href="/login">
                <Button type="submit" onClick={handleSignIn} className="w-full">
                  Criar uma conta
                </Button>
              </Link>
            </div>
          </div>
          {errorResponse && (
            <div className="text-red-500 text-sm p-2 bg-red-100 rounded-md">
              <p>Houve erro ao tentar criar um novo usuário.</p>
            </div>
          )}
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Link href="/login" className="underline">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
