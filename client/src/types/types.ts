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
  tags: Tags[];
  views_count: number;
}

export interface BlogsResponse {
  rows: Blog[];
  tags: Tags[];
}

export interface User {
  id: number;
  username: string;
  avatar_url: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  userName: string;
  avatar_url: string;
}

export interface TokenData {
  exp: number;
  iat: number;
  userId: number;
  username: string;
  avatar_url: string;
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

export interface BlogProp {
  blog: {
    title: string;
    created_at: string;
    author: string;
    authorId: number;
    blogId: number;
    avatar_url: string;
    tags: Tags[];
    image_url: string;
    views_count: number;
  };
}

export interface BlogTitleProp {
  blog: {
    avatar_url: string;
    title: string;
    created_at: string;
    author: string;
    tags: Tags[];
  };
}
