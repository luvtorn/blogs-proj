import axios from "axios";
import { UserInfo } from "../types/types";
import { userStore } from "../stores/UserStore";
import authStore from "../stores/AuthStore";
import {localUrl} from "../services/api";

class UserService {
  async getUserInfo(id: number): Promise<UserInfo[] | undefined> {
    try {
      const url = `${localUrl}/profile/${id}`;
      const { data } = await axios.get<UserInfo[]>(url);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async changeUser(
    id: number,
    username: string,
    file: File | null,
    currentImageUrl: string
  ) {
    const formData = userStore.createUserFormData(
      username,
      file,
      currentImageUrl
    );

    const url = `${localUrl}/changeUser/${id}`;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      authStore.setAuthUser({
        avatar_url: currentImageUrl,
        id: id,
        username: username,
      });
      console.log(response.data);
      localStorage.setItem("token", response.data.token);

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}

export const userService = new UserService();
