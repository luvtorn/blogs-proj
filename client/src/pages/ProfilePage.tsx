import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { userService } from "../services/User.service";
import useAuth from "../hooks/useAuth";
import Blog from "../components/Blog";
import "../styles/ProfilePage.scss";
import useHover from "../hooks/useHover";
import { MdEdit } from "react-icons/md";
import { userStore } from "../stores/UserStore";
import authStore from "../stores/AuthStore";
import { observer } from "mobx-react-lite";
import { useQuery } from "@tanstack/react-query";

const ProfilePage = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setLoggedIn, authUser } = authStore;
  const { mouseOver, mouseOut, isHovered } = useHover();
  useAuth();

  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userService.getUserInfo(Number(id)),
    select: (data) => data,
  });

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/login");
  };

  const handleChange = userStore.changeUserInfo({
    id: Number(data?.[0].user_id),
    navigate,
  });

  return (
    <>
      <Header />
      <div className="container">
        {data && (
          <div className="user-page">
            <div
              className="user-page__title"
              onMouseOver={() => mouseOver(data[0].user_id)}
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
                    data[0]?.avatar_url
                      ? `http://localhost:5000/${data[0].avatar_url}`
                      : "/avatar.svg"
                  }
                  alt="Avatar"
                />
              </div>

              <div className="user-page__title__text">
                <h2>Username: {data[0].username}</h2>
                <h4>Count of blogs: {data[0].blogs_count}</h4>
                {data[0].user_id === Number(authUser?.id) && (
                  <button className="login-btn" onClick={() => handleLogOut()}>
                    Log out
                  </button>
                )}
              </div>
            </div>
            <br />
            <h2>Users blogs</h2>
            <br />
            <div className="user-page__blogs">
              {data[0] && data[0].blogs_count > 0
                ? data[0]?.blogs.map((blog) => (
                    <Blog
                      key={blog.id}
                      blog={{
                        title: blog.title,
                        author: data[0].username,
                        authorId: data[0].user_id,
                        blogId: blog.id,
                        created_at: blog.created_at,
                        avatar_url: data[0].avatar_url,
                        tags: blog.tags,
                        image_url: blog.image_url,
                        views_count: blog.views_count,
                      }}
                    />
                  ))
                : `${data[0]?.username} has no blogs yet`}
            </div>
          </div>
        )}
      </div>
    </>
  );
});

export default ProfilePage;
