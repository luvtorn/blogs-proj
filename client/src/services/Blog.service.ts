import { User, Blog, Tags, BlogsResponse, Comment } from "../types/types";
import { api } from "./api";

class BlogService {
  async getBlogs(): Promise<Blog[]> {
    try {
      const { data } = await api.get<Blog[]>("/blogs");
      return data;
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      throw error;
    }
  }

  async getBlog(id: number): Promise<BlogsResponse> {
    try {
      const { data } = await api.get<BlogsResponse>(`/blog/${id}`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch blog with id ${id}:`, error);
      throw error;
    }
  }

  async deleteBlog(id: number) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.delete(`/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response);
    } catch (error) {
      console.error(`Failed to delete blog with id ${id}:`, error);
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const { data } = await api.get<User[]>("/users");
      return data;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    }
  }

  async changeBlog(
    id: number,
    title: string,
    content: string,
    file: File | null,
    currentImageUrl: string,
    tags: string[]
  ) {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", JSON.stringify(tags.filter((tag) => tag !== "")));
    if (file) {
      formData.append("image", file);
    } else {
      formData.append("image_url", currentImageUrl);
    }

    try {
      const token = localStorage.getItem("token");
      const { data } = await api.put(`/change/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      console.error(`Failed to change blog with id ${id}:`, error);
      throw error;
    }
  }

  async updateViewsCount(blog_id: number) {
    try {
      const response = await api.put(`/update-views/${blog_id}`);
      return response;
    } catch (error) {
      console.error(
        `Failed to update views count for blog with id ${blog_id}:`,
        error
      );
    }
  }

  async getTags(): Promise<Tags[]> {
    try {
      const { data } = await api.get<Tags[]>("/tags");
      return data;
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      throw error;
    }
  }

  async getBlogsByTags(id: number): Promise<Blog[] | undefined> {
    try {
      const { data } = await api.get<Blog[]>(`/blogs/tag/${id}`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch blogs by tag id ${id}:`, error);
    }
  }

  async getComments(blogId: number): Promise<Comment[] | undefined> {
    try {
      const { data } = await api.get<Comment[]>(`/comments/${blogId}`);
      return data;
    } catch (error) {
      console.error(
        `Failed to fetch comments for blog with id ${blogId}:`,
        error
      );
    }
  }

  async sendComment(blogId: number, userId: number, comment: string) {
    try {
      const result = await api.post("/comments", { blogId, userId, comment });
      return result;
    } catch (error) {
      console.error("Failed to send comment:", error);
    }
  }

  saveTokenToLocalStorage(token: string) {
    localStorage.setItem("token", token);
  }
}

export const blogService = new BlogService();
