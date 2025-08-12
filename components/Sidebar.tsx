'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, FolderOpen, Package, FileText, Settings, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Clients', href: '/dashboard/clients', icon: Users },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { name: 'Features', href: '/dashboard/features', icon: Package },
  { name: 'Quotes', href: '/dashboard/quotes', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Users', href: '/dashboard/users', icon: Users },
]

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="h-full w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">ClientXD</h1>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all',
                isActive
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-gray-800 text-center text-xs text-gray-400">
        © 2025 ClientXD
      </div>
    </div>
  )
}
