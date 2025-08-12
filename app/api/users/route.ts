import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import { getUserFromToken } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const user = getUserFromToken(req)

  if (!user || !["admin", "subadmin"].includes(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectToDatabase()
    const users = await User.find({}, "-password").sort({ createdAt: -1 }) // Exclude password field
    return NextResponse.json(users)
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
