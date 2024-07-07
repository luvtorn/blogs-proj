import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import { TokenData } from "../types/types";
import authStore from "../stores/AuthStore";

const useAuth = () => {
  const { setUserId, setLoggedIn } = authStore;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedUser = jwtDecode<TokenData>(token);
        setUserId(decodedUser.userId);
        setLoggedIn(true);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);
};

export default useAuth;
