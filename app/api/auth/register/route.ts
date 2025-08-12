import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import User from "@/models/User"
import connectDB from "@/lib/mongodb"

export async function POST(req: Request) {
  await connectDB()
  const { name, email, password } = await req.json()

  if (!name || !email || !password)
    return NextResponse.json({ error: "All fields required" }, { status: 400 })

  const exists = await User.findOne({ email })
  if (exists)
    return NextResponse.json({ error: "User already exists" }, { status: 409 })

  const hashed = await bcrypt.hash(password, 10)

  const user = await User.create({ name, email, password: hashed })

  return NextResponse.json({ message: "User registered", user }, { status: 201 })
}