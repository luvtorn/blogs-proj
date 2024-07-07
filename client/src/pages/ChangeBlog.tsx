import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import "../styles/CreateBlog.scss";
import { FormEvent, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "../services/Blog.service";
import useFile from "../hooks/useFile";
import useAuth from "../hooks/useAuth";

const ChangeBlog = () => {
  const [title, setTitle] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
  const navigate = useNavigate();
  const { id } = useParams();

  const { file, handleFileChange, preview, setPreview } = useFile();

  const { data } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => blogService.getBlog(Number(id)),
    select: (data) => data,
  });

  useEffect(() => {
    if (data) {
      setTitle(data.rows[0].title);
      setContent(data.rows[0].content);
      setTags(
        data.tags
          .map((tag) => tag.name)
          .filter((tag) => tag !== "")
          .join(" ")
      );
      setCurrentImageUrl(data.rows[0].image_url);
    }
  }, [data]);

  useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await blogService.changeBlog(
        Number(id),
        title,
        content,
        file,
        currentImageUrl,
        tags.split(" ")
      );
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeTags = (tags: string) => {
    setTags(tags);
  };

  return (
    <>
      <Header />
      <div className="container">
        <form className="add-blog" onSubmit={handleSubmit}>
          <input
            type="file"
            id="add-blog__file"
            hidden
            onChange={handleFileChange}
          />
          <label htmlFor="add-blog__file" className="add-blog__file">
            Upload Preview
          </label>
          {preview && (
            <div className="preview">
              <button className="delete" onClick={() => setPreview("")}>
                Delete
              </button>
              <img src={preview} alt="Preview" className="preview__image" />
            </div>
          )}
          {!preview && data?.rows[0].image_url && (
            <img
              src={`http://localhost:5000/${data.rows[0].image_url}`}
              alt="Preview"
              className="preview__image"
            />
          )}
          <input
            type="text"
            className="add-blog__title"
            placeholder="Write a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            className="add-blog__tags"
            placeholder="Tags"
            onChange={(e) => handleChangeTags(e.target.value)}
            value={tags}
          />
          <div className="tags-container">
            {tags.split(" ").map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <textarea
            className="add-blog__content"
            placeholder="Write a text..."
            onChange={(e) => setContent(e.target.value)}
            value={content}
            required
          ></textarea>
          <div className="add-blog__buttons">
            <button className="publish-btn">Publish</button>
            <Link to={"/"} className="cancel-btn">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChangeBlog;
