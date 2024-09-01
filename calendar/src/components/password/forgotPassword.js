import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./forgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // We are already logged in, so navigate to home page
    if (window.localStorage.getItem("id") != null) {
      navigate("/");
    }
  });

  async function sendlink(event) {
    setLoading(true);
    console.log("send linked clicked");
    event.preventDefault();
    console.log("email is " + email);
    if (email.length === 0) {
      console.log("email length is 0");
      setError("Please enter your email");
    } else {
      console.log(email);
      const res = await fetch("http://localhost:8080/request-password-reset", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          email,
        }),
      });
      console.log("im clicked");
      if (res.status === 201) {
        setEmail("");
        setMessage(true);
      } else {
        setError("Password not sent. try again!");
        setMessage(false);
        setEmail("");
      }
    }
    setLoading(false);
  }
  return (
    <div className="container forgot-pass">
      {loading ? (
        <span>Loading...</span>
      ) : (
        <form onSubmit={sendlink}>
          <div className="row input_box">
            <div className="col-12 header_text">Forgot Password</div>
            <div className="col-12 message">
              {message ? (
                <span>Password reset link sent successfully</span>
              ) : (
                <span className="error_message">{error}</span>
              )}
            </div>
            <div className="col-3 offset-1 col-sm-3 offset-sm-1 col-md-3 offset-md-2 col-lg-3 offset-md-2 label">
              Email &nbsp;:&nbsp;
            </div>
            <div className="col-6 col-sm-6 col-md-4 col-lg-3 input">
              <input
                type="text"
                placeholder=""
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="col-4 offset-4 forgot-password-btn">
              <button>
                <input type="submit" value="Send Reset Link" />
              </button>
              <Link to="/login" className="back-btn">
                <button type="button">Login</button>
              </Link>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
