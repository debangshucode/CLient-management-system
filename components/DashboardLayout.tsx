'use client'

import Sidebar from './Sidebar'
import { motion } from 'framer-motion'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar with fixed width on large screens */}
      <div className="hidden lg:block w-64">
        <Sidebar />
      </div>

      {/* Main content area with padding to match sidebar width */}
      <div className="flex-1">
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
