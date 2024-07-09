import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.scss";
import { FormEvent, useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(userName);

    if (password === confPassword) {
      axios
        .post("http://localhost:5000/register", { userName, password })
        .then(() => {
          navigate("/login");
        })
        .catch((error) => {
          console.error("Axios Error:", error);
        });
    } else {
      alert("Confirm your password");
    }
  };

  return (
    <>
      <Header />
      <div className="login">
        <h2>Sign up</h2>
        <br />

        <form className="login__form" onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            className="login_input"
            placeholder="Write your login..."
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

          <input
            type="password"
            className="login_password"
            placeholder="Confirm your password..."
            value={confPassword}
            onChange={(e) => setConfPassword(e.target.value)}
            required
          />

          <br />

          <div className="buttons">
            <button type="submit" className="login_btn">
              Sign up
            </button>
            <button type="button" className="sign-up_btn">
              <Link to="/login">Login</Link>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
