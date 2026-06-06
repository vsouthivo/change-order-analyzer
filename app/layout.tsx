import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Change Order Analyzer — อ่านสัญญาก่อสร้างด้วย AI',
  description: 'วิเคราะห์คำสั่งเปลี่ยนแปลงเวลาจาก PDF สัญญาก่อสร้างด้วย Claude AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className="h-full">
      <body className={`${geist.className} min-h-full flex flex-col bg-green-50`}>
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center h-14 gap-6">
            <Link href="/" className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              Change Order Analyzer
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/documents" className="text-gray-600 hover:text-gray-900 transition-colors">
                เอกสาร
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-xs text-gray-400 text-center">
            Powered by Claude AI · Built by BoomBigNose
          </div>
        </footer>
      </body>
    </html>
  )
}
