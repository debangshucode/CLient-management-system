"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface User {
  _id: string
  name: string
  email: string
  role: "admin" | "subadmin" | "user"
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users")
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      toast.error("Failed to fetch users")
    }
  }

  const updateRole = async (userId: string, newRole: string) => {
    setUpdatingUser(userId)
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      const result = await res.json()
      if (res.ok) {
        toast.success("Role updated successfully")
        fetchUsers()
      } else {
        toast.error(result.error || "Failed to update role")
      }
    } catch (err) {
      toast.error("Error updating role")
    } finally {
      setUpdatingUser(null)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" })
      const result = await res.json()

      if (res.ok) {
        toast.success("User deleted successfully")
        fetchUsers()
      } else {
        toast.error(result.error || "Failed to delete user")
      }
    } catch (err) {
      toast.error("Error deleting user")
    }
  }

  const grouped = {
    admin: users.filter((u) => u.role === "admin"),
    subadmin: users.filter((u) => u.role === "subadmin"),
    user: users.filter((u) => u.role === "user"),
  }

  const roleColors: Record<string, string> = {
    admin: "bg-red-600",
    subadmin: "bg-yellow-500",
    user: "bg-blue-600",
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Manage Users</h1>

        {/* Stats Card */}
        <div className="grid grid-cols-3 gap-4">
          {(["admin", "subadmin", "user"] as const).map((role) => (
            <div
              key={role}
              className="bg-gray-800 text-white p-4 rounded-lg border border-gray-700"
            >
              <h3 className="text-lg font-semibold capitalize">{role}s</h3>
              <p className="text-2xl mt-1">{grouped[role].length}</p>
            </div>
          ))}
        </div>

        {/* User Table/List */}
        <div className="bg-gray-900 text-white rounded-lg overflow-hidden border border-gray-700 mt-6">
          <div className="grid grid-cols-5 p-3 bg-gray-800 font-semibold text-sm border-b border-gray-700">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Change Role</span>
            <span>Action</span>
          </div>
          {users.map((user) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-5 gap-10 items-center text-sm px-3 py-3 border-b border-gray-800"
            >
              <span>{user.name}</span>
              <span className="text-gray-400">{user.email}</span>
              <Badge className={`${roleColors[user.role]} text-white text-center w-1/2`}>
                {user.role}
              </Badge>
              <Select
                value={user.role}
                onValueChange={(value) => updateRole(user._id, value)}
                disabled={updatingUser === user._id}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="subadmin">Subadmin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteUser(user._id)}
                className="bg-red-600 shadow-lg hover:bg-red-600/50 "
              >
                Delete
              </Button>
            </motion.div>
          ))}
          {users.length === 0 && (
            <p className="text-center text-gray-500 py-6">No users found.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
