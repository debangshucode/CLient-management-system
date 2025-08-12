import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Feature from '@/models/Feature';
import mongoose from 'mongoose';
import { getUserFromToken } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
   const user = getUserFromToken(request)
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    await connectToDatabase();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid feature ID' }, { status: 400 });
    }
    
    const body = await request.json();
    const feature = await Feature.findByIdAndUpdate(params.id, body, { new: true });
    
    if (!feature) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
    }
    
    return NextResponse.json(feature);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update feature' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
   const user = getUserFromToken(request)
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    await connectToDatabase();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid feature ID' }, { status: 400 });
    }
    
    const feature = await Feature.findByIdAndUpdate(
      params.id, 
      { isActive: false }, 
      { new: true }
    );
    
    if (!feature) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Feature deactivated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete feature' }, { status: 500 });
  }
}