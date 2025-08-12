import { NextRequest, NextResponse } from "next/server"
import { getUserFromToken } from "@/lib/auth"
import mongoose from "mongoose"
import connectToDatabase from "@/lib/mongodb"
import Client from "@/models/Client"




export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUserFromToken(req)
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectToDatabase()

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid client ID" }, { status: 400 })
  }

  const client = await Client.findById(params.id)
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 })
  }

  return NextResponse.json(client)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUserFromToken(req)
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectToDatabase()

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid client ID" }, { status: 400 })
  }

  const body = await req.json()
  const client = await Client.findByIdAndUpdate(params.id, body, { new: true })

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 })
  }

  return NextResponse.json(client)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUserFromToken(req)
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectToDatabase()

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid client ID" }, { status: 400 })
  }

  const client = await Client.findByIdAndDelete(params.id)
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 })
  }

  return NextResponse.json({ message: "Client deleted successfully" })
}
