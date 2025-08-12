'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="sidebar"
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3 }}
              className="relative z-50 w-64 bg-gray-900 h-full"
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Menu Button */}
        <div className="lg:hidden p-4 bg-gray-900 border-b border-gray-800 flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white"
          >
            <Menu size={28} />
          </button>
          <span className="ml-4 text-white font-bold">Dashboard</span>
        </div>

        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 lg:p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
