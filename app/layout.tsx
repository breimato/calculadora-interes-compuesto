import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Calculadora de Interés Compuesto',
  description: 'Calculadora de Interés Compuesto - Breixo',
  generator: 'Next.js',
  icons: {
    icon: '/calculadora-imagen.png',
    apple: '/calculadora-imagen.png'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
