import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.scss";
import authStore from "../stores/AuthStore";

const Header = () => {
  const { isLoggedIn, setLoggedIn } = authStore;
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/login");
  };

  return (
    <header>
      <div className="header_container">
        <Link to="/" className="main">
          BLOGS
        </Link>

        <div className="buttons">
          {isLoggedIn && (
            <button className="create">
              <Link to={isLoggedIn ? "/create" : "/login"}>Write a blog</Link>
            </button>
          )}
          {isLoggedIn ? (
            <button className="login-btn" onClick={() => handleLogOut()}>
              Log out
            </button>
          ) : (
            <button className="login-btn">
              <Link to={"/login"}>Login</Link>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
