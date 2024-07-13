import { useState } from "react";
import authStore from "../stores/AuthStore";

const useHover = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { authUser } = authStore;

  const mouseOver = (authorId: number | undefined) => {
    if (authorId === Number(authUser?.id)) {
      setIsHovered(true);
    }
  };

  const mouseOut = () => {
    setIsHovered(false);
  };

  return { isHovered, mouseOut, mouseOver };
};

export default useHover;
