import { makeAutoObservable, toJS } from "mobx";
import { NavigateFunction } from "react-router-dom";
import { User, UserInfo } from "../types/types";
import { userService } from "../services/User.service";

interface UserStoreParams {
  id: number;
  navigate: NavigateFunction;
}

class UserStore {
  constructor() {
    makeAutoObservable(this);
  }

  changeUserInfo =
    ({ id, navigate }: UserStoreParams) =>
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      navigate(`/changeUser/${id}`);
    };

  createUserFormData = (
    username: string,
    file: File | null,
    currentImageUrl: string
  ) => {
    const formData = new FormData();
    formData.append("username", username);
    if (file) {
      formData.append("image", file);
    } else {
      formData.append("image_url", currentImageUrl);
    }

    return formData;
  };
}

export const userStore = new UserStore();
