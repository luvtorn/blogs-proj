import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import { TokenData } from "../types/types";
import authStore from "../stores/AuthStore";
import { userService } from "../services/User.service";

const useAuth = () => {
  const { setLoggedIn, setAuthUser } = authStore;

  const checkTokenExpiration = (token: string) => {
    const decodedUser = jwtDecode<TokenData>(token);
    const currentTime = Date.now() / 1000;
    if (decodedUser.exp < currentTime) {
      localStorage.removeItem("token");
      setLoggedIn(false);
      setAuthUser(null);
      return false;
    }
    return true;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        if (checkTokenExpiration(token)) {
          const decodedUser = jwtDecode<TokenData>(token);
          setAuthUser({
            username: decodedUser.username,
            avatar_url: decodedUser.avatar_url,
            id: decodedUser.userId,
          });
          userService.getUserInfo(decodedUser.userId);
          setLoggedIn(true);
        }
      } catch (error) {
        console.log(error);
        localStorage.removeItem("token");
        setLoggedIn(false);
        setAuthUser(null);
      }
    }
  }, []);
};

export default useAuth;
