import { makeAutoObservable } from "mobx";

class AuthStore {
  isLoggedIn = false;
  login = "";
  userId = 0;

  constructor() {
    makeAutoObservable(this);
  }

  setLoggedIn = (isAuth: boolean) => {
    this.isLoggedIn = isAuth;
  };

  setUserId = (userId: number) => {
    this.userId = userId;
  };

  setLogin = (login: string) => {
    this.login = login;
  };
}

const authStore = new AuthStore();

export default authStore;
