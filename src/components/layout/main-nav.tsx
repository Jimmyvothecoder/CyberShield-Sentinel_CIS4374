'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  Mail,
  Shield,
  Wifi,
  MessageSquare,
  Settings
} from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Email Security', href: '/email-security', icon: Mail },
  { name: 'Malware Scan', href: '/malware-scan', icon: Shield },
  { name: 'Network Security', href: '/network-security', icon: Wifi },
  { name: 'AI Assistant', href: '/ai-assistant', icon: MessageSquare, beta: true },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center px-4 py-2 text-sm font-medium rounded-lg',
              'hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
              isActive
                ? 'bg-gray-100 dark:bg-gray-800 text-primary'
                : 'text-gray-600 dark:text-gray-300'
            )}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
            {item.beta && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                BETA
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
