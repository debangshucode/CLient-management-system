import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Feature from '@/models/Feature';
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = getUserFromToken(req)
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    await connectToDatabase();
    const features = await Feature.find({ isActive: true }).sort({ category: 1, title: 1 });
    return NextResponse.json(features);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch features' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromToken(request)
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    await connectToDatabase();
    const body = await request.json();

    const feature = new Feature(body);
    await feature.save();

    return NextResponse.json(feature, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create feature' }, { status: 500 });
  }
}