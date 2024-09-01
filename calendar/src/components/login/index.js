import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, Route, Routes } from "react-router-dom";
import GrayBackground from "../grayBackground";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userError, setUserError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // We are already logged in, so navigate to home page
    if (window.localStorage.getItem("id") != null) {
      navigate("/");
    }
  });

  async function loginuser(event) {
    event.preventDefault();
    setLoading(true);
    if (username.length === 0) {
      setUserError("please enter username");
      console.log("password is valid");
    }
    if (password.length === 0) {
      setUserError("password is required");
    }
    if (username.length > 0 && password.length > 0) {
      console.log("login function called reat js");
      await fetch("http://localhost:8080/login", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);

          if (data.status === 201) {
            console.log(data.status);
            console.log(data.result.user._id);
            window.localStorage.setItem("token", data.result.token);
            window.localStorage.setItem("id", data.result.user._id);
            setPassword("");
            setUsername("");
            setUserError("");
            navigate("/");
          } else {
            setPassword("");
            setUsername("");
            setUserError("Invalid Credentials. Please try again");
          }
        })
        .catch((err) => {
          setPassword("");
          setUsername("");
          setUserError("Invalid Credentials. Please try again");
        });
    }
    setLoading(false);
  }

  return (
    <div className="login-page">
      <GrayBackground />
      {loading ? (
        <span>Loading...</span>
      ) : (
        <div className="login">
          <div className="col-6 offset-3 header_text">
            <span>Login</span>
          </div>
          <form onSubmit={loginuser}>
            <div className="col-6 col-md-7 col-xl-7 offset-xl-3 col-xl-6 offset-md-3 offset-3 error_msg">
              <span>{userError}</span>
            </div>
            <div className="row input_box">
              <div className="col-3 offset-1 col-sm-3 offset-sm-1 col-md-3 offset-md-2 col-lg-3 offset-md-2 label">
                Username &nbsp;:&nbsp;
              </div>
              <div className="col-6 col-sm-6 col-md-4 col-lg-3 input">
                <input
                  type="text"
                  placeholder=""
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="row input_box">
              <div className="col-3 offset-1 col-sm-3 offset-sm-1 col-md-3 offset-md-2 col-lg-3 offset-md-2 label">
                Password &nbsp;:&nbsp;
              </div>
              <div className="col-6 col-sm-6 col-md-4 col-lg-3 input">
                <input
                  type="password"
                  placeholder=""
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="forgot_password">
                  <span onClick={() => navigate("/forgot-password")}>
                    Forgot Password
                  </span>
                </div>
              </div>
            </div>

            <div className="row d-flex flex-column btn_container">
              <div className="col d-flex justify-content-center">
                <div className="login_btn">
                  <input type="submit" value="Login" />
                </div>
              </div>
              <div className="col align-self-center text-center signup_link_container">
                <span className="is_sign_up">
                  Not signed up yet?{" "}
                  <span
                    className="sign_up_link"
                    onClick={() => navigate("/signup")}
                  >
                    click here
                  </span>{" "}
                  to sign up
                </span>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
