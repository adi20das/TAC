import React from "react";
// import '../authentication/PasswordStrength';
import zxcvbn from "zxcvbn";
const PasswordStrength = ({ password }) => {
  // console.log(password);
  const testResult = zxcvbn(password);
  const num = (testResult.score * 100) / 4;

  const createPasswordLabel = () => {
    switch (testResult.score) {
      case 0:
        return "Very weak";
      case 1:
        return "Weak";
      case 2:
        return "Average";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };
  console.log(num);
  const funcProgressColor = () => {
    switch (testResult.score) {
      case 0:
        return "#828282";
      case 1:
        return "#EA1111";
      case 2:
        return "#FFAD00";
      case 3:
        return "#9b1158";
      case 4:
        return "#00b500";
      default:
        return "none";
    }
  };
  const changePasswordColor = () => ({
    width: `${num}%`,

    background: funcProgressColor(),
    borderRadius: "50px",
    height: "12px",
  });
  return (
    <div className="strength-checker">
      <div className="progress">
        <div className="progress-bar" style={changePasswordColor()}></div>
      </div>
      <span className="password-strength-value">{createPasswordLabel()}</span>
    </div>
  );
};

export default PasswordStrength;
