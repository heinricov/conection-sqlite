"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export default function PostForm({
  onPostCreated,
}: {
  onPostCreated?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        throw new Error(data.message || 'Gagal menambahkan post');
      }
      
      setStatus({ type: "success", message: "✅ Post berhasil ditambahkan" });
      setTitle("");
      setContent("");
      // Panggil callback untuk memperbarui daftar post
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setStatus({
        type: "error",
        message: `❌ ${
          error instanceof Error ? error.message : "Terjadi kesalahan"
        }`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto  rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold  mb-6">Buat Post Baru</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-400"
          >
            Judul
          </label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukkan judul post"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-400"
          >
            Isi Konten
          </label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tulis isi konten di sini..."
            rows={4}
            required
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Mengirim..." : "Simpan Post"}
          </Button>

          {status && (
            <div
              className={`px-4 py-2 rounded-md text-sm ${
                status.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {status.message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
