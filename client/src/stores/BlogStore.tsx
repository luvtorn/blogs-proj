import { makeAutoObservable, toJS } from "mobx";
import { blogService } from "../services/Blog.service";
import { NavigateFunction } from "react-router-dom";
import { Blog } from "../types/types";

interface BlogStoreParams {
  id: number;
  navigate: NavigateFunction;
}

class BlogStore {
  blogs: Blog[] | undefined = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setBlogs = (data: Blog[] | undefined) => {
    this.blogs = data;
  };

  getBlogs = () => {
    return toJS(this.blogs);
  };

  getBlogById = (id: number) => {
    blogService.getBlogs();
    return this.getBlogs()?.filter((blog) => blog.blog_id === id);
  };

  getBlogsByTag = (tagId: number) => {
    return toJS(this.getBlogs())?.filter((blog) =>
      blog.tags.some((tag) => tag.id === tagId)
    );
  };

  getBlogsByProfile = (profileId: number) => {
    return toJS(this.getBlogs())?.filter((blog) => blog.user_id === profileId);
  };

  changeBlog =
    ({ id, navigate }: BlogStoreParams) =>
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      navigate(`/change/${id}`);
    };

  deleteBlog =
    ({ id, navigate }: BlogStoreParams) =>
    async (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      await blogService.deleteBlog(Number(id));
      navigate("/");
    };
}

export const blogStore = new BlogStore();