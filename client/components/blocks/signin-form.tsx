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

interface SignInFormProps {
  CreateAccountButton?: React.ReactNode
}

export function SignInForm({ CreateAccountButton }: SignInFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [errorResponse, setErrorResponse] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  // Error states
  const [firstNameError, setFirstNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [formError, setFormError] = useState('') // General form error

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
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !username.trim() ||
      !password.trim()
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

    try {
      if (!firstNameError && !lastNameError && !emailError) {
        await postUser(username, password, firstName, lastName, email)
        setErrorResponse(false)
      }
    } catch (error: any) {
      setErrorResponse(true)
      setErrorMessage(error.response.data.username[0])
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Cadastrar</CardTitle>
          <CardDescription>
            Insira as informações para criar uma nova conta.
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
                  onBlur={handleBlurFirstName}
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
                  onBlur={handleBlurLastName}
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
                onBlur={handleBlurEmail}
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
                type="text"
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
            {formError && (
              <div className="text-red-500 text-sm p-2 bg-red-100 rounded-md">
                <p>{formError}</p>
              </div>
            )}
            <div className="grid mt-4">
              {CreateAccountButton ? (
                <div onClick={handleSignIn}>{CreateAccountButton}</div>
              ) : (
                <Button type="submit" onClick={handleSignIn} className="w-full">
                  Criar uma conta
                </Button>
              )}
            </div>
          </div>
          {errorResponse && (
            <div className="mt-2 text-red-500 text-sm p-2 bg-red-100 rounded-md">
              <p>{errorMessage}</p>
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
