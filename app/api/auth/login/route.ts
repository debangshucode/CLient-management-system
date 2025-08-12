import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

export async function POST(req: Request) {
  const { email, password } = await req.json()
  await connectToDatabase()

  const user = await User.findOne({ email })
  if (!user)
    return NextResponse.json({ message: "Invalid email" }, { status: 401 })

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch)
    return NextResponse.json({ message: "Invalid password" }, { status: 401 })

  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  )

  const response = NextResponse.json({ message: "Login successful" }, {
    status: 200,
    headers: {
      "Set-Cookie": `token=${token}; Path=/; HttpOnly; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`,
    },
  })

  return response
}
