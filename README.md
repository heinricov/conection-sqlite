# 🚀 Next.js + SQLite + Prisma Starter

Proyek ini merupakan contoh integrasi **Next.js (App Router)** dengan **SQLite** sebagai database, dan **Prisma** sebagai ORM. Dilengkapi fitur API untuk `Post`, form input, dan penampilan data.

---

## 📦 Instalasi dan Setup

### 1. Inisialisasi Prisma & SQLite

```bash
npm install prisma --save-dev
npx prisma init --datasource-provider sqlite
```

### 2. Konfigurasi prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  createdAt DateTime @default(now())
}
```

### 3. Migrasi Database

```bash
npx prisma migrate dev --name init
```

### 4. Install Prisma Client

```bash
npm install @prisma/client
npx prisma generate
```

### 5. Setup Prisma Client di Next.js

Buat file: lib/prisma.ts

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### 6. API Route - POST dan GET Post

buat file: app/api/posts/route.ts

```typescript
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await prisma.post.findMany();
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.title || !body.content) {
    return NextResponse.json(
      { error: "Title and content required" },
      { status: 400 }
    );
  }

  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return NextResponse.json(post);
}
```

### 7. Komponen Form Input Post

buat file: app/components/PostForm.tsx

```typescript
"use client";

import { useState } from "react";

export default function PostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      setStatus("✅ Post berhasil ditambahkan");
      setTitle("");
      setContent("");
    } else {
      setStatus("❌ Gagal menambahkan post");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md space-y-4 p-4 border rounded-md"
    >
      <h2 className="text-xl font-bold">Buat Post Baru</h2>

      <div>
        <label className="block font-medium">Judul</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Isi Konten</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
          rows={4}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        {loading ? "Mengirim..." : "Kirim"}
      </button>

      {status && <p className="mt-2">{status}</p>}
    </form>
  );
}
```

### 8. Komponen List Post

buat file: app/components/PostList.tsx

```typescript
"use client";

import { useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold">Daftar Post</h2>
      <ul className="mt-2 space-y-2">
        {posts.map((p) => (
          <li key={p.id} className="border p-3 rounded-md">
            <strong>{p.title}</strong>
            <p>{p.content}</p>
            <small className="text-sm text-gray-500">
              {new Date(p.createdAt).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 9. Contoh Halaman Utama (app/page.tsx)

buat file: app/page.tsx

```typescript
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <PostForm />
      <PostList />
    </div>
  );
}
```

### 10. Struktur Folder (Contoh)

```
.
├── app/
│   ├── api/
│   │   └── posts/
│   │       └── route.ts
│   ├── components/
│   │   ├── PostForm.tsx
│   │   └── PostList.tsx
│   └── page.tsx
├── lib/
│   └── prisma.ts
├── prisma/
│   ├── dev.db
│   └── schema.prisma
├── README.md
├── package.json
```

### 11. Run Project

```bash
npm run dev
```
