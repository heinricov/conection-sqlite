// app/api/posts/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await prisma.post.findMany();
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
    },
  });
  return NextResponse.json(post);
}
