import React from "react";
import { useState, useEffect } from "react";
import {
  useNavigate,
  useParams,
  Route,
  Routes,
  json,
  Link,
} from "react-router-dom";
import "./resetpass.css";

const ResetPassword = () => {
  const [cpassword, setCpassword] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { token } = useParams();

  useEffect(() => {
    // We are already logged in, so navigate to home page
    if (window.localStorage.getItem("id") != null) {
      navigate("/");
    }
  });

  const sendpassword = async (e) => {
    setLoading(true);
    e.preventDefault();
    const passwordReg =
      /^(?=.*[0-9])(?=.*[!@#$%^&*-])[a-zA-Z0-9!@#$%^&*-\s]{10,}$/;
    if (password.length === 0) {
      setMessage("please enter password");
      console.log("password is valid");
    } else if (!passwordReg.test(password)) {
      setMessage("password is invalid");
      console.log("password is invalid");
    } else if (!passwordReg.test(cpassword)) {
      setMessage("invalid confirm password");
    } else if (cpassword.length === 0) {
      setMessage("Enter confirm password");
    } else if (cpassword !== password) {
      setMessage("password and confirmed password are not matched");
    } else {
      await fetch(`http://localhost:8080/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 201) {
            setPassword("");
            setCpassword("");
            setMessage("password change successfully");
            console.log("user valid");
            alert("password change successfully");
            navigate("/login");
          } else {
            console.log("somethisn wrong" + data.message);
            setMessage(data.message);
          }
        })
        .catch((e) => {
          setMessage("password not changed");
        });
    }
    setLoading(false);
  };

  return (
    <div className="resetpass container">
      {loading ? (
        <span>Loading...</span>
      ) : (
        <form onSubmit={sendpassword}>
          <div className="row input-box">
            <div className="col-12 header_text">Reset Password</div>
            <div className="col-12 message">{message}</div>
            <div className="col-3 offset-1 col-sm-3 col-md-3  col-lg-3 offset-md-1 offset-lg-2 offset-sm-1 col-xl-2 offset-xl-2 label">
              <span>New Password :&nbsp;</span>
            </div>
            <div className="col-7 col-sm-5   col-md-5 col-lg-4 col-xl-4    input">
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="row input-box">
            <div className="col-3 offset-1 col-sm-3 col-md-3  col-lg-3 offset-md-1 offset-lg-2 offset-sm-1 col-xl-3 offset-xl-1 label">
              <span>Confirm Password :&nbsp;</span>
            </div>
            <div className="col-7 col-sm-5   col-md-5 col-lg-4 col-xl-4  input">
              <input
                type="password"
                onChange={(e) => setCpassword(e.target.value)}
              />
            </div>
          </div>
          <div className="row btn">
            <div className="d-flex button-box ">
              <input type="submit" value="Confirm" />
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

export default ResetPassword;
