import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.scss";
import { FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import authStore from "../stores/AuthStore";
import Header from "../components/Header";
import { blogService } from "../services/Blog.service";
import { LoginResponse } from "../types/types";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setLoggedIn, setAuthUser } = authStore;
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
      .post<LoginResponse>("http://localhost:5000/login", {
        userName,
        password,
      })
      .then((response) => {
        const { token } = response.data;
        blogService.saveTokenToLocalStorage(token);
        setLoggedIn(true);
        setAuthUser({
          id: response.data.userId,
          avatar_url: response.data.avatar_url,
          username: response.data.userName,
        });
        navigate("/");
      })
      .catch((error: AxiosError<{ error: string }>) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          const errorMessage = error.response.data.error;
          setError(errorMessage);
        } else {
          console.log("Произошла ошибка при запросе:", error.message);
        }
      });
  };

  return (
    <>
      <Header />
      <div className="login">
        <h2>Sign in</h2>
        <br />

        <form className="login__form" onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            className="login_input"
            placeholder="Write your username..."
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />

          <input
            type="password"
            className="login_password"
            placeholder="Write your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <br />

          <div className="buttons">
            <button type="submit" className="login_btn">
              Login
            </button>
            <Link to="/register" className="sign-up_btn">
              Sign up
            </Link>
          </div>
        </form>
        <br />
        {error && <h3 style={{ textAlign: "center" }}>{error}</h3>}
      </div>
    </>
  );
};

export default Login;
