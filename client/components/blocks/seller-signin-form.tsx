'use client'

import { useState } from 'react'
import Link from 'next/link'
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
import { Eye, EyeOff } from 'lucide-react'

export function SellerSignInForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [errorResponse, setErrorResponse] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)

  // Error states
  const [firstNameError, setFirstNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [formError, setFormError] = useState('') // General form error

  // Validation functions
  const validateName = (name: string) => /^[a-zA-ZÀ-ÿ\s]+$/.test(name)
  const validateUsername = (username: string) =>
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{6,24}$/.test(username)
  const validateEmail = (email: string) =>
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
  const validatePassword = (password: string) =>
    /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$/.test(
      password
    )

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

  const handleBlurPassword = () => {
    if (!validatePassword(password)) {
      setPasswordError(
        'A senha deve ter de 8 a 32 caracteres, conter pelo menos um número, uma letra maiúscula, uma letra minúscula e um caractere especial.'
      )
    } else {
      setPasswordError('')
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
      if (
        !firstNameError &&
        !lastNameError &&
        !emailError &&
        !passwordError &&
        !usernameError
      ) {
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
                onBlur={handleBlurUsername}
                placeholder="Max_Robinson"
                required
              />
              {usernameError && (
                <div className="text-red-500 text-sm p-2 bg-red-100 rounded-md">
                  <p>{usernameError}</p>
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <div className="flex justify-beetwen items-center">
                <Input
                  id="password"
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handleBlurPassword}
                  required
                />
                {passwordVisible && (
                  <Eye
                    className="h-6 w-6 ml-4"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  />
                )}
                {!passwordVisible && (
                  <EyeOff
                    className="h-6 w-6 ml-4"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  />
                )}
              </div>
              {passwordError && (
                <div className="text-red-500 text-sm p-2 bg-red-100 rounded-md">
                  <p>{passwordError}</p>
                </div>
              )}
            </div>
            {formError && (
              <div className="text-red-500 text-sm p-2 bg-red-100 rounded-md">
                <p>{formError}</p>
              </div>
            )}
          </div>
          {errorResponse && (
            <div className="mt-2 text-red-500 text-sm p-2 bg-red-100 rounded-md">
              <p>{errorMessage}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
