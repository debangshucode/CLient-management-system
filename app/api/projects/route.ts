import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import Client from '@/models/Client';
import {getUserFromToken} from "@/lib/auth";

export async function GET(req: NextRequest) {
   const user = getUserFromToken(req)
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    await connectToDatabase();
    const projects = await Project.find({})
      .populate('clientId', 'name email company')
      .sort({ createdAt: -1 });

    const serialized = projects.map((p) => ({
      ...p.toObject(),
      _id: p._id.toString(),
      clientId: {
        ...p.clientId.toObject(),
        _id: p.clientId._id.toString()
      }
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
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

    const project = new Project(body);
    await project.save();

    // Update client project count
    await Client.findByIdAndUpdate(
      body.clientId,
      { $inc: { projectCount: 1 } }
    );

    const populatedProject = await Project.findById(project._id)
      .populate('clientId', 'name email company');

    return NextResponse.json(populatedProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}