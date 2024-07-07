export interface Blog {
  blog_id: number;
  id: number;
  user_id: number;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
  username: string;
  avatar_url: string;
}

export interface BlogsResponse {
  rows: Blog[];
  tags: Tags[];
}

export interface User {
  id: number;
  username: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  userName: string;
}

export interface TokenData {
  exp: number;
  iat: number;
  userId: number;
  username: string;
}

export interface Tags {
  id: number;
  name: string;
}

export interface UserInfo {
  user_id: number;
  username: string;
  avatar_url: string;
  blogs_count: number;
  blogs: Blog[];
}
