const API_URL = 'http://localhost:3000';

export type User = {
  id: number;
  username: string;
  email?: string;
};

export type Post = {
  id: number;
  content: string;
  createdAt: string;
  author: User;
  likes: { userId: number }[];
  comments: Comment[];
};

export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  author: User;
  postId: number;
};

function ensureToken(token: string | null): string {
  if (!token) throw new Error('User is not authenticated');
  return token;
}

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || 'Registration failed');
  }

  return json;
}

export async function loginUser(data: { username: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || 'Login failed');
  }

  return json as { access_token: string; user: User };
}

export async function getPosts(token: string | null): Promise<Post[]> {
  const t = ensureToken(token);

  const res = await fetch(`${API_URL}/posts`, {
    headers: { Authorization: `Bearer ${t}` },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }

  return res.json();
}

export async function createPost(token: string | null, content: string): Promise<Post> {
  const t = ensureToken(token);

  const res = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    throw new Error('Failed to create post');
  }

  return res.json();
}

export async function toggleLike(token: string | null, postId: number): Promise<void> {
  const t = ensureToken(token);

  const res = await fetch(`${API_URL}/posts/${postId}/like`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${t}` },
  });

  if (!res.ok) {
    throw new Error('Failed to toggle like');
  }
}

export async function getUserProfile(username: string) {
  const res = await fetch(`${API_URL}/users/${username}`);

  if (!res.ok) {
    throw new Error('User not found');
  }

  return res.json();
}

export async function uploadProfilePic(token: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_URL}/users/upload-profile-pic`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export async function getCommentsForPost(postId: number): Promise<Comment[]> {
  const res = await fetch(`${API_URL}/posts/${postId}/comments`);

  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }

  return res.json();
}

export async function addComment(
  token: string | null,
  postId: number,
  content: string
): Promise<Comment> {
  const t = ensureToken(token);

  const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${t}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    throw new Error("Failed to add comment");
  }

  return res.json();
}