import { FC, memo } from "react";
import "../styles/Blog.scss";
import { FaEye } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { blogStore } from "../stores/BlogStore";
import useHover from "../hooks/useHover";
import { BlogProp } from "../types/types";
import { blogService } from "../services/Blog.service";
import BlogTitle from "./BlogTitle";

const Blog: FC<BlogProp> = ({ blog }) => {
  const navigate = useNavigate();
  const { mouseOver, mouseOut, isHovered } = useHover();

  const openBlogInfo = (blogId: number) => {
    try {
      blogService.updateViewsCount(blogId);
      navigate(`/blog/${blogId}`);
    } catch (error) {
      console.error("Error opening blog info", error);
    }
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
      onClick={() => openBlogInfo(blog.blogId)}
    >
      {blog.image_url && (
        <img src={`http://localhost:5000/${blog.image_url}`} alt="preview" />
      )}
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

      <BlogTitle blog={blog} />
      <div className="blog__name">
        <h3>{blog.title}</h3>
      </div>
      <div className="blog__footer">
        <p>
          {blog.views_count}
          <FaEye />
        </p>
      </div>
    </div>
  );
};

export default memo(Blog);
