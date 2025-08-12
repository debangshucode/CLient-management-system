import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from '@/lib/mongodb';
import Client from '@/models/Client';
import Project from '@/models/Project';
import Quote from '@/models/Quote';
import { getUserFromToken } from "@/lib/auth"


export async function GET(req: NextRequest) {
  const user = getUserFromToken(req)
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    await connectToDatabase();

    const [clientCount, projectCount, quoteCount, totalValue] = await Promise.all([
      Client.countDocuments(),
      Project.countDocuments(),
      Quote.countDocuments(),
      Quote.aggregate([
        { $match: { status: { $in: ['sent', 'accepted'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    const activeProjects = await Project.countDocuments({
      status: { $in: ['planning', 'in-progress'] }
    });

    const recentQuotes = await Quote.find({})
      .populate('clientId', 'name')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json({
      stats: {
        clients: clientCount,
        projects: projectCount,
        activeProjects,
        quotes: quoteCount,
        totalValue: totalValue[0]?.total || 0,
      },
      recentQuotes,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}