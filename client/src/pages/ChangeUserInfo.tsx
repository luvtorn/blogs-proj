import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";
import { Link, useNavigate, useParams } from "react-router-dom";
import { userService } from "../services/User.service";
import useAuth from "../hooks/useAuth";
import Blog from "../components/Blog";
import "../styles/ProfilePage.scss";
import { FormEvent, useEffect, useState } from "react";
import useFile from "../hooks/useFile";

const ChangeUserInfo = () => {
  const [username, setUsername] = useState<string>("");
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
  const { file, handleFileChange, preview, setPreview } = useFile();
  const navigate = useNavigate();

  const { id } = useParams();

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: () => userService.getUserInfo(Number(id)),
    select: (data) => data,
    enabled: !!id,
  });

  console.log(data);

  useEffect(() => {
    if (data) {
      setUsername(data[0].username);
      setCurrentImageUrl(data[0].avatar_url);
    }
  }, [data]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await userService.changeUser(Number(id), username, file, currentImageUrl);
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  useAuth();

  return (
    <>
      <Header />
      <div className="container">
        <div className="user-page">
          <div className="user-change-page__title">
            <form className="change-user" onSubmit={(e) => handleSubmit(e)}>
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

              {!preview && data?.[0].avatar_url && (
                <img
                  src={`http://localhost:5000/${data?.[0].avatar_url}`}
                  alt="Preview"
                  className="preview__image"
                />
              )}

              <input
                type="text"
                value={username}
                className="change-user__title"
                onChange={(e) => setUsername(e.target.value)}
              />

              <div className="change-user__buttons">
                <button className="publish-btn">Publish</button>
                <Link to={"/"} className="cancel-btn">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
          <br />
          <h2>Users blogs</h2>
          <br />
          <div className="user-page__blogs">
            {data && data?.[0].blogs_count > 0
              ? data?.[0].blogs.map((blog) => (
                  <Blog
                    key={blog.id}
                    blog={{
                      title: blog.title,
                      author: data[0].username,
                      authorId: data[0].user_id,
                      blogId: blog.id,
                      time: blog.created_at,
                      avatar_url: blog.avatar_url,
                      tags: blog.tags,
                    }}
                  />
                ))
              : `${data?.[0].username} has no blogs yet`}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangeUserInfo;
