import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.scss";
import authStore from "../stores/AuthStore";
import { observer } from "mobx-react-lite";
import useAuth from "../hooks/useAuth";

const Header = observer(() => {
  const { isLoggedIn, authUser } = authStore;
  const navigate = useNavigate();

  useAuth();

  return (
    <header>
      <div className="header_container">
        <Link to="/" className="main">
          BLOGS
        </Link>

        <div className="buttons">
          {isLoggedIn && (
            <button className="create">
              <Link to="/create">Write a blog</Link>
            </button>
          )}
          {isLoggedIn && authUser ? (
            <div
              className="user"
              key={authUser.id}
              onClick={() => navigate(`/profile/${authUser.id}`)}
            >
              <img
                src={
                  authUser.avatar_url
                    ? `http://localhost:5000/${authUser.avatar_url}`
                    : "/avatar.svg"
                }
                alt="avatar"
              />
              <span className="user__name">{authUser.username}</span>
            </div>
          ) : (
            <button className="login-btn">
              <Link to="/login">Login</Link>
            </button>
          )}
        </div>
      </div>
    </header>
  );
});

export default Header;
