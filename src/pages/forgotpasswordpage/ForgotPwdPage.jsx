import React, { useState } from "react";
import {
  Box,
  useTheme,
  useMediaQuery,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import "./ForgotPwdPage.css";
import { notification } from "../../utils/utils";
import { ToastContainer } from "react-toastify";
import { BE_URL } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

const otpLength = 6;
const ForgotPwdPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { palette } = theme;
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [vals, setVals] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    emailtouched: false,
    pwdtouched: false,
  });
  const [step, setStep] = useState("email");
  const [otp, setOtp] = useState(Array(otpLength).fill(""));
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVals({ ...vals, [name]: value });
  };
  const handleEmailBlur = (e) => {
    let msg = "";
    if (!vals.email.trim()) {
      msg = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(vals.email)) {
      msg = "Enter a Valid Mail Id";
    } else {
      msg = "";
    }
    setErrors({ ...errors, email: msg, emailtouched: true });
  };
  const handlePwdBlur = (e) => {
    let msg = "";
    if (!vals.password.trim()) {
      msg = "Required";
    } else if (vals.password.length < 6) {
      msg = "Atleast 6 Characters";
    }
    setErrors({ ...errors, password: msg, pwdtouched: true });
  };
  const handleOtpChange = (e, ind) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[ind] = value;
      setOtp(newOtp);
      if (value && ind < otpLength - 1) {
        const nextInput = document.getElementById(`otp-input-${ind + 1}`);
        nextInput?.focus();
      }
    }
  };
  const handleOtpKeyDown = (e, ind) => {
    if (e.key === "Backspace") {
      if (otp[ind] === "" && ind > 0) {
        const prevInput = document.getElementById(`otp-input-${ind - 1}`);
        prevInput?.focus();
      }
    }
  };
  const handleSubmitClick = async (e) => {
    e.preventDefault();
    console.log("ER:::", errors);
    if (step === "email") {
      if (!errors.email) {
        try {
          const res = await fetch(BE_URL + "/auth/forgotpassword1", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: vals.email }),
          });
          const result = await res.json();
          if (!res.ok) {
            throw new Error(result.error);
          }
          notification(result.message, "");
          setStep("otp");
        } catch (error) {
          notification("", error.message);
        }
      }
    } else if (step === "otp") {
      try {
        let otpText = "";
        otp.forEach((i) => {
          otpText += i;
        });
        const res = await fetch(BE_URL + "/auth/forgotpassword2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: vals.email, otp: otpText }),
        });
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error);
        }
        notification(result.message, "");
        setStep("newPwd");
      } catch (error) {
        notification("", error.message);
      }
    } else if (step === "newPwd" && !errors.password) {
      try {
        const res = await fetch(BE_URL + "/auth/forgotpassword3", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: vals.email, password: vals.password }),
        });
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error);
        }
        notification(result.message, "");
        // setTimeout(() => {
        //   navigate("/");
        // }, 2000);
      } catch (error) {
        notification("", error.message);
      }
    }
  };
  const handleLogin = () => {
    navigate("/");
  };
  console.log("STEP::::", step);
  return (
    <Box>
      <ToastContainer />
      <Box
        width="100%"
        backgroundColor={palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          Sociopedia
        </Typography>
      </Box>
      <Box width={"30%"} m={"auto"}>
        <Typography textAlign={"center"} variant="h4" mb={"5px"}>
          Forgot Password
        </Typography>
        <TextField
          label="Email"
          value={vals.email}
          name="email"
          onChange={handleChange}
          onBlur={handleEmailBlur}
          error={Boolean(errors.emailtouched) && Boolean(errors.email)}
          helperText={errors.emailtouched && errors.email}
          sx={{ width: "100%" }}
          disabled={step !== "email"}
        />
        {(step === "otp" || step === "newPwd") && (
          <>
            {
              <div className="otp-wrapper">
                {otp.map((_, index) => {
                  return (
                    <input
                      id={`otp-input-${index}`}
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      disabled={step !== "otp"}
                    />
                  );
                })}
              </div>
            }
          </>
        )}
        {step === "newPwd" && (
          <>
            <TextField
              label="Password"
              value={vals.password}
              name="password"
              onChange={handleChange}
              onBlur={handlePwdBlur}
              error={Boolean(errors.pwdtouched) && Boolean(errors.password)}
              helperText={errors.pwdtouched && errors.password}
              sx={{ width: "100%", mt: "10px" }}
            />
          </>
        )}
        <Typography
          sx={{
            textDecoration: "underline",
            color: palette.primary.main,
            mt: "1rem",
            "&:hover": {
              cursor: "pointer",
              color: palette.primary.dark,
            },
          }}
          onClick={handleLogin}
        >
          Back to Login
        </Typography>
        <Button
          fullWidth
          type="submit"
          onClick={handleSubmitClick}
          sx={{
            m: "2rem 0",
            p: "1rem",
            backgroundColor: palette.primary.main,
            color: palette.background.alt,
            "&:hover": { color: palette.primary.main },
          }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default ForgotPwdPage;
