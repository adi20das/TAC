import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./change-password.css";

const ChangePassword = () => {
  const [cpassword, setCpassword] = useState("");
  const [okcpass, setOkcpass] = useState(false);
  const [okpass, setOkpass] = useState(false);
  const [cpasswordErr, setCpasswordErr] = useState("");
  const [okoldpass, setOkoldpass] = useState(false);
  const [oldpassword, setOldpassword] = useState("");
  const [oldpasswordErr, setOldpasswordErr] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMatch, setIsMatch] = useState(false);

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/settings");
  };

  const userValid = async () => {
    if (!localStorage.getItem("id")) {
      navigate("/login");
    }
  };
  useEffect(() => {
    userValid();
  }, []);

  const sendpassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const passwordReg =
      /^(?=.*[0-9])(?=.*[!@#$%^&*-])[a-zA-Z0-9!@#$%^&*-\s]{10,}$/;
    if (password.length === 0) {
      setPasswordErr("please enter password");
      setOkpass(false);
    } else if (!passwordReg.test(password)) {
      setPasswordErr("password is invalid");
      setOkpass(false);
    } else {
      setPasswordErr("");
      setOkpass(true);
    }

    if (!passwordReg.test(cpassword)) {
      setCpasswordErr("invalid confirm password");
      setOkcpass(false);
    } else if (cpassword.length === 0) {
      setCpasswordErr("confirm your password");
      setOkcpass(false);
    } else {
      setCpasswordErr("");
      setOkcpass(true);
    }

    if (oldpassword.length === 0) {
      setOldpasswordErr("please enter old password");
      setOkoldpass(false);
    } else {
      setOldpasswordErr("");
      setOkoldpass(true);
    }
    if (cpassword !== password) {
      setMessage("password and confirmed password are not matched");
      setIsMatch(false);
    } else {
      setIsMatch(true);
      setMessage("");
    }

    if (
      okoldpass === true &&
      okcpass === true &&
      okpass === true &&
      isMatch === true
    ) {
      console.log("inside fetch");
      const id = window.localStorage.getItem("id");
      await fetch(`http://localhost:8080/users/${id}/update-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldpassword, password }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log("res is" + res);
          if (res.status === 201) {
            alert("password successfully changed");
            setMessage("password change successfully");
            console.log("user valid");
            console.log(res.message);
            setOldpassword("");
            setPassword("");
            setCpassword("");
            navigate("/");
          }

          if (res.status === 401) {
            // alert("password not changed. please try again.");
            setOldpassword("");
            setPassword("");
            setCpassword("");
            setMessage(res.message);
            // console.log("not valid");
          }
        })
        .catch(() => {
          setMessage("password not changed");
          setOldpassword("");
          setPassword("");
          setCpassword("");
        });
    } else {
      console.log(okpass + okcpass + okoldpass + isMatch);
    }
    setLoading(false);
  };

  return (
    <div className="container changeoldpassword">
      {loading ? (
        <span>Loading...</span>
      ) : (
        <form onSubmit={sendpassword}>
          <div className="row input-box">
            <div className="col-12 header_text">Change Password</div>
            <div className="col-12 message">{message}</div>
            <div className="col-3 offset-1 col-sm-3 col-md-3  col-lg-3 offset-md-1 offset-lg-2 offset-sm-1 col-xl-2 offset-xl-2 label">
              <span>Old Password :&nbsp;</span>
            </div>
            <div className="col-7 col-sm-5   col-md-5 col-lg-4 col-xl-4    input">
              <input
                type="password"
                onChange={(e) => setOldpassword(e.target.value)}
              />
              <span className="error_msg">{oldpasswordErr}</span>
            </div>
          </div>

          <div className="row input-box">
            <div className="col-3 offset-1 col-sm-3 col-md-3  col-lg-3 offset-md-1 offset-lg-2 offset-sm-1 col-xl-2 offset-xl-2 label">
              <span>New Password :&nbsp;</span>
            </div>
            <div className="col-7 col-sm-5   col-md-5 col-lg-4 col-xl-4  input">
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="error_msg">{passwordErr}</span>
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
              <span className="error_msg">{cpasswordErr}</span>
            </div>
          </div>
          <div className="row btn">
            <div className="d-flex button-box ">
              <input type="submit" value="Confirm" />
            </div>
          </div>
          <button
            type="button"
            className="password-cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default ChangePassword;
