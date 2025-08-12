"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogIn, LogOut, User } from "lucide-react"
import Link from "next/link"
import LoginRegisterModal from "./LoginRegisterModal"

export default function FloatingNav() {
  const [open, setOpen] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    setLoggedIn(!!token)
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setLoggedIn(false)
    setDropdown(false)
    router.push("/")
  }

  const handleSuccess = () => {
    setLoggedIn(true)
    setOpen(false)
    router.push("/dashboard")
  }

  return (
    <>
      {/* Floating Nav */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 
                      bg-gray-900/80 backdrop-blur-md px-6 py-2 
                      rounded-full shadow-lg flex items-center space-x-6 
                      border border-gray-700">
        <Link href="/" className="text-white hover:text-blue-400">Home</Link>
        <Link href="/about" className="text-white hover:text-blue-400">About</Link>
        <Link href="/contact" className="text-white hover:text-blue-400">Contact</Link>

        {loading ? (
          <button disabled className="px-4 py-2 bg-gray-700 text-gray-300 rounded animate-pulse">
            Loading...
          </button>
        ) : !loggedIn ? (
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center"
          >
            <LogIn className="mr-2" size={16} /> Login
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setDropdown(prev => !prev)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center"
            >
              <User className="mr-2" size={16} /> My Account
            </button>
            {dropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded z-50">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  <LogOut className="inline mr-2" size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Centered Login Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <LoginRegisterModal onClose={() => setOpen(false)} onSuccess={handleSuccess} />
        </div>
      )}
    </>
  )
}
