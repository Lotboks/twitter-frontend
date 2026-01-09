export interface User {
    id: number;
    username: string;
    email?: string;
  }
  
  export interface Post {
    id: number;
    content: string;
    createdAt: string;
    author: User;
  }
  