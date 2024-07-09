import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { userService } from "../services/User.service";
import useAuth from "../hooks/useAuth";
import Blog from "../components/Blog";
import "../styles/ProfilePage.scss";
import useHover from "../hooks/useHover";
import { MdEdit } from "react-icons/md";
import { userStore } from "../stores/UserStore";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { mouseOver, mouseOut, isHovered } = useHover();
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: () => userService.getUserInfo(Number(id)),
    select: (data) => data,
    enabled: !!id,
  });

  const handleChange = userStore.changeUserInfo({
    id: Number(data?.[0].user_id),
    navigate,
  });

  useAuth();

  return (
    <>
      <Header />
      <div className="container">
        <div className="user-page">
          <div
            className="user-page__title"
            onMouseOver={() => mouseOver(data?.[0].user_id)}
            onMouseOut={() => mouseOut()}
          >
            {isHovered && (
              <div className="user-page__edit-btns">
                <button onClick={handleChange}>
                  <MdEdit size={"17px"} />
                </button>
              </div>
            )}
            <div className="image-container">
              <img
                src={
                  data?.[0].avatar_url
                    ? `http://localhost:5000/${data?.[0].avatar_url}`
                    : "/avatar.svg"
                }
                alt="Avatar"
              />
            </div>

            <div className="user-page__title__text">
              <h2>Username: {data?.[0].username}</h2>
              <h4>Count of blogs: {data?.[0].blogs_count}</h4>
            </div>
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
                      avatar_url: data?.[0].avatar_url,
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

export default ProfilePage;
