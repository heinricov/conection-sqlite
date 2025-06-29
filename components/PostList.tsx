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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const result = await res.json();
        
        if (result.success) {
          setPosts(result.data || []);
        } else {
          console.error("Gagal memuat data:", result.message);
        }
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="p-4">Memuat data...</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID");
  };

  return (
    <div className="w-full overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Daftar Post</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500">Belum ada data post.</p>
      ) : (
        <table className="min-w-full rounded-lg overflow-hidden">
          <thead className="border-2">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-r-2">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-r-2">
                Judul
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-r-2">
                Isi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-r-2">
                Dibuat Pada
              </th>
            </tr>
          </thead>
          <tbody className="border-2">
            {posts.map((post) => (
              <tr key={post.id} className="">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r-2">
                  {post.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 border-r-2">
                  {post.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate border-r-2">
                  {post.content}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r-2">
                  {formatDate(post.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
