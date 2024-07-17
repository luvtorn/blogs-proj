import axios from "axios";
import { User, Blog, Tags, BlogsResponse } from "../types/types";
import { blogStore } from "../stores/BlogStore";

class BlogService {
  async getBlogs(): Promise<Blog[]> {
    const url = "http://localhost:5000/blogs";
    const { data } = await axios.get<Blog[]>(url);
    blogStore.setBlogs(data);
    return data;
  }

  async getBlog(id: number): Promise<BlogsResponse> {
    const url = `http://localhost:5000/blog/${id}`;
    const { data } = await axios.get<BlogsResponse>(url);
    return data;
  }

  async deleteBlog(id: number) {
    const url = `http://localhost:5000/blog/${id}`;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }

  async getUsers(): Promise<User[]> {
    const url = "http://localhost:5000/users";
    const { data } = await axios.get<User[]>(url);
    return data;
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

    const url = `http://localhost:5000/change/${id}`;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async updateViewsCount(blog_id: number) {
    const url = `http://localhost:5000/update-views/${blog_id}`;
    try {
      const response = await axios.put(url);
      return response;
    } catch (error) {
      console.log(error, "failed to update views count");
    }
  }

  async getTags(): Promise<Tags[]> {
    const url = "http://localhost:5000/tags";
    const { data } = await axios.get<Tags[]>(url);
    return data;
  }

  async getBlogsByTags(id: number): Promise<Blog[] | undefined> {
    try {
      const url = `http://localhost:5000/blogs/tag/${id}`;
      const { data } = await axios.get<Blog[]>(url);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async sendComment(userId: number, blogId: number, comment: string) {
    try {
      const url = "http://localhost:5000/comments";
      const result = await axios.post(url, { userId, blogId, comment });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  saveTokenToLocalStorage = (token: string) => {
    localStorage.setItem("token", token);
  };
}

export const blogService = new BlogService();
