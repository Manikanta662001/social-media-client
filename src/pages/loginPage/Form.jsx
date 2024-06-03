import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  Alert,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as YUP from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import Dropzone, { useDropzone } from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";
import { loginpageType } from "../../utils/constants";

const registerSchema = YUP.object().shape({
  firstName: YUP.string().required("required"),
  lastName: YUP.string().required("required"),
  email: YUP.string().email("Enter a Valid email").required("required"),
  password: YUP.string().required("required"),
  location: YUP.string().required("required"),
  occupation: YUP.string().required("required"),
  picture: YUP.mixed().required("required"),
});

const loginSchema = YUP.object().shape({
  email: YUP.string().email("Enter a Valid email").required("required"),
  password: YUP.string().required("required"),
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
        onSubmitProps.resetForm();
        setPageType("login");
      }
    } catch (error) {
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
        dispatch(setLogin(userData));
        navigate(`/profile/${userData.user._id}`);
      }
    } catch (error) {
      console.error("ERR::::", error.message);
    }
  };

  const handleFormSubmit = (values, onSubmitProps) => {
    console.log("VALS::::", values, onSubmitProps);
    if (loginpageType(pageType)) {
      login(values, onSubmitProps);
    } else {
      register(values, onSubmitProps);
    }
  };
  return (
    <Formik
      initialValues={
        loginpageType(pageType) ? loginInitialValues : registerInitialValues
      }
      validationSchema={loginpageType(pageType) ? loginSchema : registerSchema}
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
              {!loginpageType(pageType) && (
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
                        'image/jpeg':['.jpg','.jpeg',],
                        'image/png': ['.png'],
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
                {loginpageType(pageType) ? "LOGIN" : "REGISTER"}
              </Button>
              <Typography
                onClick={() => {
                  setPageType(loginpageType(pageType) ? "register" : "login");
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
                {loginpageType(pageType)
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
