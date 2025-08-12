import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Quote from '@/models/Quote';
import mongoose from 'mongoose';
import { getUserFromToken } from "@/lib/auth";


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
   const user = getUserFromToken(request)
  if (!user || (user.role !== "admin" && user.role !== "subadmin")) {

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    await connectToDatabase();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid quote ID' }, { status: 400 });
    }
    
    const quote = await Quote.findById(params.id)
      .populate('clientId', 'name email company address phone')
      .populate('projectId', 'title description');
      
    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    
    return NextResponse.json(quote);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
   const user = getUserFromToken(request)
  if (!user || (user.role !== "admin" && user.role !== "subadmin")) {

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    await connectToDatabase();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid quote ID' }, { status: 400 });
    }
    
    const body = await request.json();
    const quote = await Quote.findByIdAndUpdate(params.id, body, { new: true })
      .populate('clientId', 'name email company')
      .populate('projectId', 'title');
    
    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    
    return NextResponse.json(quote);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
  }
}