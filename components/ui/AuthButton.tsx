"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogIn, LogOut, User } from "lucide-react"
import LoginRegisterModal from "../LoginRegisterModal"

export default function AuthButton() {
  const [open, setOpen] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    setLoggedIn(!!token)
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
    <div className="abosolute right-4 top-0 flex items-center space-x-2">
      {!loggedIn ? (
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-black text-white rounded"
        >
          <LogIn className="inline mr-2" size={16} /> Login / Register
        </button>
      ) : (
        <button
          onClick={() => setDropdown((prev) => !prev)}
          className="px-4 py-2 bg-black text-white rounded flex items-center"
        >
          <User className="mr-2" size={16} /> My Account
        </button>
      )}

      {dropdown && loggedIn && (
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

      {open && <LoginRegisterModal onClose={() => setOpen(false)} onSuccess={handleSuccess} />}
    </div>
  )
}
