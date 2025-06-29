// app/api/posts/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data post' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, message: 'Judul dan konten harus diisi' },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      data: post,
      message: 'Post berhasil ditambahkan' 
    });
    
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Terjadi kesalahan saat menambahkan post' 
      },
      { status: 500 }
    );
  }
}
