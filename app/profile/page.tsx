'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile } from '@/lib/api';
import Image from 'next/image';

type Post = {
  id: number;
  content: string;
  createdAt: string;
};

type UserProfile = {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePic?: string;
  posts: Post[];
};

export default function ProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const data: UserProfile = await getUserProfile(token);
        setProfile(data);
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };

    fetchProfile();
  }, [token]);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        {profile.profilePic ? (
          <Image
            src={profile.profilePic}
            alt="Profile"
            className="w-16 h-16 rounded-full"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300" />
        )}
        <div>
          <h1 className="text-2xl font-bold">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-gray-500">@{profile.username}</p>
          <p className="text-gray-500">{profile.email}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Posts</h2>
      {profile.posts.map((post: Post) => (
        <div key={post.id} className="border p-4 mb-4 rounded">
          <p>{post.content}</p>
          <span className="text-gray-500 text-xs">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
