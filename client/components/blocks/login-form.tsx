import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
export function LoginForm() {
  return (
    <div className="h-screen flex items-center justify-center">
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                Informe as credenciais para fazer login.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="username">Usuário</Label>
                    <Input
                    id="username"
                    type="text"
                    required
                    />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                    <Label htmlFor="password">Senha</Label>
                    {/* <Link href="#" className="ml-auto inline-block text-sm underline">
                        Forgot your password?
                    </Link> */}
                    </div>
                    <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                    Login
                </Button>
                {/* <Button variant="outline" className="w-full">
                    Login with Google
                </Button> */}
                </div>
                <div className="mt-4 text-center text-sm">
                Não possui uma conta?{" "}
                <Link href="#" className="underline">
                    Se cadastrar
                </Link>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}