import { NextRequest, NextResponse } from "next/server"
import { getUserFromToken } from "@/lib/auth"
import connectToDatabase from "@/lib/mongodb"
import Client from "@/models/Client"

export async function GET(req: NextRequest) {
  const user = getUserFromToken(req)

 if (!user || (user.role !== "admin" && user.role !== "subadmin")) {

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectToDatabase()
  const clients = await Client.find({}).sort({ createdAt: -1 })
  return NextResponse.json(clients)
}

export async function POST(req: NextRequest) {
  const user = getUserFromToken(req)

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const client = new Client(body)
  await client.save()
  return NextResponse.json(client, { status: 201 })
}
