"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

import { getUserProfile, uploadProfilePic } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type Post = {
  id: number;
  content: string;
  createdAt: string;
  likes: { userId: number }[];
};

type UserProfile = {
  id: number;
  username: string;
  profilePic: string | null;
  posts: Post[];
};

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { token } = useAuth();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [previewPic, setPreviewPic] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    getUserProfile(username)
      .then((data) => {
        setUser(data);
        setPreviewPic(data.profilePic);
      })
      .catch(console.error);
  }, [username]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !token || !user) return;

    const file = e.target.files[0];

    const localPreview = URL.createObjectURL(file);
    setPreviewPic(localPreview);

    try {
      const updatedUser = await uploadProfilePic(token, file);

      setUser((prev) =>
        prev ? { ...prev, profilePic: updatedUser.profilePic } : prev
      );

      setPreviewPic(updatedUser.profilePic);
    console.log("Backend profilePic:", updatedUser.profilePic);

    } catch (err) {
      console.error(err);
      setPreviewPic(user.profilePic);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Image
          src={previewPic || "/globe.svg"}
          alt="Profile"
          width={80}
          height={80}
          className="rounded-full object-cover"
        />

        <div>
          <h1 className="text-2xl font-bold">@{user.username}</h1>

          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="mt-2 text-sm"
          />
        </div>
      </div>

      {user.posts.map((post) => (
        <div key={post.id} className="border p-4 mb-4 rounded">
          <p>{post.content}</p>
          <span className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
