import { makeAutoObservable } from "mobx";
import { blogService } from "../services/Blog.service";
import { NavigateFunction } from "react-router-dom";

interface BlogStoreParams {
  id: number;
  navigate: NavigateFunction;
}

class BlogStore {
  constructor() {
    makeAutoObservable(this);
  }

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
