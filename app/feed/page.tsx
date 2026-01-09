"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getPosts,
  createPost,
  toggleLike,
  addComment,
  getCommentsForPost,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type Comment = {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    profilePic?: string;
  };
  createdAt: string;
};

type Post = {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    username: string;
    profilePic?: string;
  };
  likes: { userId: number }[];
  comments?: Comment[];
};

export default function Feed() {
  const { token, logout } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>(
    {}
  );

  const loadPosts = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getPosts(token);
      const postsWithComments = await Promise.all(
        data.map(async (post: Post) => {
          const comments = await getCommentsForPost(post.id);
          return { ...post, comments };
        })
      );
      setPosts(postsWithComments);
    } catch (err) {
      console.error("No Posts", err);
    }
  }, [token]);

  useEffect(() => {
    const fetch = async () => {
      if (!token) {
        router.push("/login");
        return;
      }
      await loadPosts();
    };
    fetch();
  }, [token, router, loadPosts]);

  const handleCreatePost = async () => {
    if (!newPost.trim() || !token) return;
    try {
      await createPost(token, newPost);
      setNewPost("");
      await loadPosts();
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  const handleToggleLike = async (postId: number) => {
    if (!token) return;
    try {
      await toggleLike(token, postId);
      await loadPosts();
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  const handleCommentChange = (postId: number, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleAddComment = async (postId: number) => {
    if (!token || !commentInputs[postId]?.trim()) return;
    try {
      await addComment(token, postId, commentInputs[postId]);
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      await loadPosts();
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feed</h1>
        <button
          className="text-red-500 text-sm"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          Logout
        </button>
      </div>

      <div className="mb-6">
        <textarea
          className="border p-2 w-full mb-2"
          rows={3}
          placeholder="What's happening?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button
          onClick={handleCreatePost}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </div>

      {posts.map((post) => (
        <div key={post.id} className="border p-4 mb-4 rounded">
          <div className="flex items-center gap-3 mb-2">
            <Link href={`/profile/${post.author.username}`}>
              <Image
                src={post.author.profilePic || "/globe.svg"}
                alt={post.author.username}
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>
            <Link href={`/profile/${post.author.username}`}>
              <span className="font-semibold hover:underline">
                {post.author.username}
              </span>
            </Link>
          </div>
          <p className="my-2">{post.content}</p>
          <div className="flex items-center gap-4 mb-2">
            <button
              className="text-sm text-blue-500"
              onClick={() => handleToggleLike(post.id)}
            >
              {post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
            </button>
            <span className="text-gray-500 text-xs">
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="mt-2 border-t pt-2">
            {(post.comments || []).map((comment) => (
              <div key={comment.id} className="ml-4 mb-2">
                <Link href={`/profile/${post.author.username}`}>
                  <div className="flex items-center gap-2">
                    <Image
                      src={comment.author.profilePic || "/globe.svg"}
                      width={30}
                      height={30}
                      alt={comment.author.username}
                      className="rounded-full"
                    />
                    <span className="font-semibold">
                      @{comment.author.username}
                    </span>
                  </div>
                </Link>
                <p className="ml-8">{comment.content}</p>
              </div>
            ))}

            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Write a comment..."
                className="flex-1 border rounded px-2 py-1"
                value={commentInputs[post.id] || ""}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-3 rounded"
                onClick={() => handleAddComment(post.id)}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
