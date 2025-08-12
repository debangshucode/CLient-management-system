import { useState } from "react"
import axios from "@/utils/axios"
import { toast } from "sonner"

interface Props {
  onClose: () => void
  onSuccess: () => void
}

export default function LoginRegisterModal({ onClose, onSuccess }: Props) {
  const [isLogin, setIsLogin] = useState(true)
  const [data, setData] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    try {
      const url = isLogin ? "/auth/login" : "/auth/register"
      const payload = isLogin
        ? { email: data.email, password: data.password }
        : data

      const res = await axios.post(url, payload, { withCredentials: true })
      const msg = res.data?.message?.toLowerCase() || ""

      if (msg.includes("login successful")) {
        toast.success("Login successful")
        onSuccess()
      } else if (msg.includes("registered")) {
        toast.success("Registered successfully. Please login.")
        setIsLogin(true)
        setData({ name: "", email: "", password: "" })
      } else {
        toast(res.data?.message || "Success")
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed"
      toast.error(msg)
      setError(msg)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      style={{ backdropFilter: "blur(2px)" }}
    >
      <div className="bg-white p-6 rounded-lg w-full max-w-sm space-y-4 shadow-2xl transform transition-all scale-100">
        <h2 className="text-xl font-bold">{isLogin ? "Login" : "Register"}</h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="w-full px-3 py-2 text-gray-900 border rounded"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          className="w-full px-3 py-2 text-gray-900 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          className="w-full px-3 py-2 text-gray-900 border rounded"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded"
          >
            {isLogin ? "Login" : "Register"}
          </button>
          <button onClick={onClose} className="text-gray-500">
            Close
          </button>
        </div>

        <p className="text-sm text-gray-600">
          {isLogin ? "New user?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError("")
            }}
            className="text-blue-500 underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  )
}

