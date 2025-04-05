import Link from 'next/link'
import { Shield } from 'lucide-react'

export function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center space-x-2">
      <Shield className="w-8 h-8 text-primary" />
      <span className="text-xl font-bold">CyberShield</span>
    </Link>
  )
}
