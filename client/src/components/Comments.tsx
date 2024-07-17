import { FormEvent, useState } from "react";
import authStore from "../stores/AuthStore";
import "../styles/Comments.scss";
import { IoSend } from "react-icons/io5";
import { blogService } from "../services/Blog.service";

interface CommentsProps {
  blogId: number;
}

const Comments = ({ blogId }: CommentsProps) => {
  const { authUser, isLoggedIn } = authStore;
  const [error, setError] = useState("");
  const [comment, setComment] = useState("")

  const handleSendComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoggedIn && authUser) {
      const { id } = authUser;

      await blogService.sendComment(blogId, id, comment);
    } else {
      setError("You need to log in for write a comment");
    }
  };

  return (
    <div className="comments">
      <div className="comments__items">
        <div className="comment">
          <div className="comment__user">
            <img src={"/avatar.svg"} className="blog__avatar" alt="avatar" />
            <h4>123</h4>
          </div>
          <div className="comment__text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat a,
            reiciendis minus cumque explicabo, aliquid aut eum reprehenderit
            dolor, pariatur omnis assumenda laudantium fugit mollitia molestiae
            recusandae. Cupiditate, impedit minima!
          </div>
        </div>
      </div>

      <form className="comments__form" onSubmit={(e) => handleSendComment(e)}>
        <textarea placeholder="Write a comment..." value={comment} o></textarea>
        <button type="submit">
          <IoSend size={"17px"} color="white" />
        </button>
      </form>
      <br />
      <h4 style={{ color: "red" }}>{error}</h4>
    </div>
  );
};

export default Comments;
