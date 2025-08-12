'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Users,
  FolderOpen,
  Package,
  FileText,
  Menu,
  X,
  BarChart3,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Clients', href: '/dashboard/clients', icon: Users },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { name: 'Features', href: '/dashboard/features', icon: Package },
  { name: 'Quotes', href: '/dashboard/quotes', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  {name: 'Users', href: '/dashboard/users', icon: Users },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const SidebarContent = (
    <div className="h-full w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">ClientXD</h1>
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <X className="h-5 w-5" />
        </button>
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
              onClick={() => setIsOpen(false)}
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

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="relative z-50">{SidebarContent}</div>
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50"
          />
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">{SidebarContent}</div>
    </>
  )
}
