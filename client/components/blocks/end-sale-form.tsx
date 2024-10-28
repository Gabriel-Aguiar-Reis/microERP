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

export default function EndSaleForm() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle>Obrigado!</CardTitle>
          <CardDescription>
            Sua venda foi devidamente registrada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <span>Gostaria de registrar uma nova venda?</span>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              window.location.href = '/form'
            }}
          >
            Sim
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
