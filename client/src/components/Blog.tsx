import { FC, memo } from "react";
import "../styles/Blog.scss";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { blogStore } from "../stores/BlogStore";
import useHover from "../hooks/useHover";
import useData from "../hooks/useData";
import { Tags } from "../types/types";

interface blogProp {
  blog: {
    title: string;
    time: string;
    author: string;
    authorId: number;
    blogId: number;
    avatar_url: string;
    tags: Tags[];
  };
}

const Blog: FC<blogProp> = ({ blog }) => {
  const navigate = useNavigate();
  const { mouseOver, mouseOut, isHovered } = useHover();

  const openBlogInfo = () => {
    navigate(`/blog/${blog.blogId}`);
  };

  const handleDelete = blogStore.deleteBlog({
    id: Number(blog.blogId),
    navigate,
  });
  const handleChange = blogStore.changeBlog({
    id: Number(blog.blogId),
    navigate,
  });

  return (
    <div
      className="blog"
      onMouseOver={() => mouseOver(blog.authorId)}
      onMouseOut={() => mouseOut()}
      onClick={openBlogInfo}
    >
      {isHovered && (
        <div className="blog__edit-btns">
          <button onClick={handleChange}>
            <MdEdit size={"17px"} />
          </button>
          <button onClick={handleDelete}>
            <MdDelete size={"17px"} />
          </button>
        </div>
      )}

      <div className="blog__title">
        <img
          src={`http://localhost:5000/${
            blog.avatar_url !== null ? blog.avatar_url : "/avatar.svg"
          }`}
          alt="avatar"
        />
        <div className="blog__text">
          <h4>{blog.author}</h4>
          <div className="blog-page__tags">
            {blog?.tags.map((tag) => (
              <p key={tag.id}>{tag.name}</p>
            ))}
          </div>
          <p>{useData(blog.time)}</p>
        </div>
      </div>
      <div className="blog__name">
        <h3>{blog.title}</h3>
      </div>
    </div>
  );
};

export default memo(Blog);