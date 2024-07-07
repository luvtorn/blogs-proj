import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../styles/CreateBlog.scss";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import authStore from "../stores/AuthStore";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const CreateBlog = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const { isLoggedIn, userId } = authStore;
  const navigate = useNavigate();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPreview(fileURL);
      setFile(file);
    } else {
      setPreview("Can not preview this file");
      setFile(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("userId", String(userId));
    if (file) {
      formData.append("image", file);
    }

    tags
      .filter((tag) => tag !== "")
      .forEach((tag, index) => {
        formData.append(`tags[]`, tag);
      });

    try {
      const response = await axios.post(
        "http://localhost:5000/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeTags = (tagsInput: string) => {
    const tagsArray = tagsInput.split(" ").filter((tag) => tag.trim() !== "");
    setTags(tagsArray);
  };

  useAuth();

  return (
    <>
      <Header />
      <div className="container">
        <form className="add-blog" onSubmit={(e) => handleSubmit(e)}>
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
          />

          {tags.length > 0 ? (
            <div className="tags-container">
              {tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            ""
          )}

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

export default CreateBlog;
