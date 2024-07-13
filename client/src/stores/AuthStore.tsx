import { makeAutoObservable, toJS } from "mobx";
import { User } from "../types/types";

class AuthStore {
  isLoggedIn = false;
  authUser: User | null = {
    id: 0,
    username: "",
    avatar_url: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setLoggedIn = (isAuth: boolean) => {
    this.isLoggedIn = isAuth;
  };

  setAuthUser = (user: User | null) => {
    this.authUser = user;
  };
}

const authStore = new AuthStore();

export default authStore;
