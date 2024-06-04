import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik } from "formik";
import * as YUP from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";
import { getpage, notification } from "../../utils/constants";

const registerSchema = YUP.object().shape({
  firstName: YUP.string().required("required").min(3, "Minimum 3 Characters"),
  lastName: YUP.string().required("required").min(3, "Minimum 3 Characters"),
  email: YUP.string().email("Enter a Valid email").required("required"),
  password: YUP.string().required("required").min(6, "Minimum 6 Characters"),
  location: YUP.string().required("required"),
  occupation: YUP.string().required("required"),
  picture: YUP.mixed().required("required"),
});

const loginSchema = YUP.object().shape({
  email: YUP.string().email("Enter a Valid email").required("required"),
  password: YUP.string().required("required").min(6, "Minimum 6 Characters"),
});

const registerInitialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const loginInitialValues = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isNonMobileScreens = useMediaQuery("(min-width:600px)");
  const register = async (values, onSubmitProps) => {
    try {
      const formData = new FormData();
      formData.append("user", JSON.stringify(values));
      formData.append("picture", values.picture);
      const res = await fetch("/auth/register", {
        method: "POST",
        body: formData,
      });
      const userData = await res.json();
      if (userData) {
        notification("User Registered Successfully", "");
        onSubmitProps.resetForm();
        setPageType("login");
      }
    } catch (error) {
      notification("", error.message);
      console.error("ERR::::", error.message);
    }
  };
  const login = async (values, onSubmitProps) => {
    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      console.log("RES::::", res);
      const userData = await res.json();
      if (userData) {
        notification("Login Successful", "");
        dispatch(setLogin(userData));
        navigate(`/profile/${userData.user._id}`);
      }
    } catch (error) {
      notification("", error.message);
      console.error("ERR::::", error.message);
    }
  };

  const handleFormSubmit = (values, onSubmitProps) => {
    console.log("VALS::::", values, onSubmitProps);
    if (getpage(pageType)) {
      login(values, onSubmitProps);
    } else {
      register(values, onSubmitProps);
    }
  };
  return (
    <Formik
      initialValues={
        getpage(pageType) ? loginInitialValues : registerInitialValues
      }
      validationSchema={getpage(pageType) ? loginSchema : registerSchema}
      onSubmit={handleFormSubmit}
    >
      {({
        errors,
        values,
        handleBlur,
        handleChange,
        handleSubmit,
        touched,
        setFieldValue,
        resetForm,
      }) => (
        <>
          <ToastContainer />
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": {
                  gridColumn: isNonMobileScreens ? undefined : "span 4",
                },
              }}
            >
              {!getpage(pageType) && (
                <>
                  <TextField
                    label="First Name"
                    value={values.firstName}
                    name="firstName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      Boolean(touched.firstName) && Boolean(errors.firstName)
                    }
                    helperText={touched.firstName && errors.firstName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label="Last Name"
                    value={values.lastName}
                    name="lastName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      Boolean(touched.lastName) && Boolean(errors.lastName)
                    }
                    helperText={touched.lastName && errors.lastName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label="Location"
                    value={values.location}
                    name="location"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      Boolean(touched.location) && Boolean(errors.location)
                    }
                    helperText={touched.location && errors.location}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label="Occupation"
                    value={values.occupation}
                    name="occupation"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      Boolean(touched.occupation) && Boolean(errors.occupation)
                    }
                    helperText={touched.occupation && errors.occupation}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <Box
                    gridColumn="span 4"
                    border={`1px solid ${palette.neutral.medium}`}
                    borderRadius="5px"
                    p="1rem"
                  >
                    <Dropzone
                      accept={{
                        "image/jpeg": [".jpg", ".jpeg"],
                        "image/png": [".png"],
                      }}
                      multiple={false}
                      onDrop={(acceptedFiles) => {
                        setFieldValue("picture", acceptedFiles[0]);
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <Box
                          {...getRootProps({ className: "dropzone" })}
                          border={`2px dashed ${palette.primary.main}`}
                          p="1rem"
                          sx={{ "&:hover": { cursor: "pointer" } }}
                        >
                          <input {...getInputProps()} />
                          {!values.picture ? (
                            <p>Add Picture Here</p>
                          ) : (
                            <FlexBetween>
                              <Typography>{values.picture.name}</Typography>
                              <EditOutlinedIcon />
                            </FlexBetween>
                          )}
                        </Box>
                      )}
                    </Dropzone>
                  </Box>
                </>
              )}
              <TextField
                label="Email"
                value={values.email}
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Password"
                type="password"
                value={values.password}
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            {/* BUTTONS */}
            <Box>
              <Button
                fullWidth
                type="submit"
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
              >
                {getpage(pageType) ? "LOGIN" : "REGISTER"}
              </Button>
              <Typography
                onClick={() => {
                  setPageType(getpage(pageType) ? "register" : "login");
                  resetForm();
                }}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              >
                {getpage(pageType)
                  ? "Don't have an account? Sign Up here."
                  : "Already have an account? Login here."}
              </Typography>
            </Box>
          </form>
        </>
      )}
    </Formik>
  );
};

export default Form;
