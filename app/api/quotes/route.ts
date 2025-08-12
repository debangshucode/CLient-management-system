import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Quote from '@/models/Quote';
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
   const user = getUserFromToken(req)
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    await connectToDatabase();
    const quotes = await Quote.find({})
      .populate('clientId', 'name email company')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 });
    return NextResponse.json(quotes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
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
    
    // Generate quote number
    const quoteCount = await Quote.countDocuments();
    const quoteNumber = `Q${String(quoteCount + 1).padStart(4, '0')}`;
    
    const quote = new Quote({
      ...body,
      quoteNumber,
    });
    
    await quote.save();
    
    const populatedQuote = await Quote.findById(quote._id)
      .populate('clientId', 'name email company')
      .populate('projectId', 'title');
    
    return NextResponse.json(populatedQuote, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
  }
}