// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'As 7 Chaves',
  description: 'Sistema de funis de vendas e marketing digital',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50`}>
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-blue-600">As 7 Chaves</h1>
              <nav>
                <ul className="flex space-x-4">
                  <li>
                    <a href="/" className="text-gray-700 hover:text-blue-600">Dashboard</a>
                  </li>
                  <li>
                    <a href="/webhooks" className="text-gray-700 hover:text-blue-600">Webhooks</a>
                  </li>
                  <li>
                    <a href="/settings" className="text-gray-700 hover:text-blue-600">Configurações</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}
