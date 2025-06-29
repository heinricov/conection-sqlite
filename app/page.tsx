"use client";

import { useState, useCallback } from "react";
import PostForm from "@/components/PostForm";
import PostList from "@/components/PostList";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Fungsi untuk me-refresh daftar post
  const handlePostCreated = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2">
            Ini adalah konenksi ke database SQLite
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
          {/* Form untuk membuat post baru */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <PostForm onPostCreated={handlePostCreated} />
            </div>
          </div>

          {/* Daftar post */}
          <div className="lg:col-span-2">
            <div className="p-6 rounded-lg shadow">
              <PostList key={refreshKey} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
