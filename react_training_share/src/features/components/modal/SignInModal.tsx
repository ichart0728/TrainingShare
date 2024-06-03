import React, { useState } from "react";
import { AppDispatch } from "../../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./Modal.module.css";
import Modal from "react-modal";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { TextField, Button, CircularProgress } from "@material-ui/core";
// import { fetchAsyncGetPosts } from "../../api/postApi";
// import { fetchAsyncGetComments } from "../../api/commentApi";
import { fetchAsyncGetTrainingMenus } from "../../api/trainingMenuApi";
import { fetchAsyncGetTrainingSessions } from "../../api/workoutApi";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "../../types";
import {
  selectIsLoadingAuth,
  selectOpenSignIn,
  setOpenSignUp,
  resetOpenSignIn,
  fetchCredStart,
  fetchCredEnd,
} from "../../auth/authSlice";
import {
  fetchToken,
  fetchAsyncLogin,
  fetchAsyncGetProfs,
  fetchAsyncGetMyProf,
} from "../../api/authApi";

const SignInModal: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const openSignIn = useSelector(selectOpenSignIn);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  const [loginError, setLoginError] = useState("");
  const [cookies, setCookie] = useCookies();

  return (
    <Modal
      isOpen={openSignIn}
      onRequestClose={async () => {
        await dispatch(resetOpenSignIn());
        setLoginError("");
      }}
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.modalContent}>
        <Formik
          initialErrors={{ email: "required" }}
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values) => {
            await dispatch(fetchCredStart());
            try {
              const { access, refresh } = await fetchToken(
                values.email,
                values.password
              );
              const decoded: JwtPayload = jwtDecode(access);
              const expiryDate = new Date(decoded.exp * 1000);

              // クッキーにJWTトークンを保存
              setCookie("accesstoken", access, {
                path: "/",
                expires: expiryDate,
              });
              setCookie("refreshtoken", refresh, {
                path: "/",
                expires: expiryDate,
              });

              await dispatch(fetchAsyncGetProfs());
              // await dispatch(fetchAsyncGetPosts());
              // await dispatch(fetchAsyncGetComments());
              await dispatch(fetchAsyncGetMyProf());
              await dispatch(fetchAsyncGetMyProf());
              await dispatch(fetchAsyncGetTrainingMenus());
              await dispatch(fetchAsyncGetTrainingSessions());
              await dispatch(resetOpenSignIn());
              navigate("/workout_history");
            } catch (error) {
              setLoginError("Invalid email or password");
            }
            await dispatch(fetchCredEnd());
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("email format is wrong")
              .required("email is must"),
            password: Yup.string().required("password is must").min(4),
          })}
        >
          {({ errors, touched, isValid }) => (
            <Form className={styles.formContainer}>
              <h1 className={styles.authTitle}>Training Share</h1>
              <div className={styles.authProgress}>
                {isLoadingAuth && <CircularProgress />}
              </div>
              <Field
                as={TextField}
                placeholder="email"
                type="input"
                name="email"
                fullWidth
                margin="normal"
              />
              {touched.email && errors.email && (
                <div className={styles.authError}>{errors.email}</div>
              )}
              <Field
                as={TextField}
                placeholder="password"
                type="password"
                name="password"
                fullWidth
                margin="normal"
              />
              {touched.password && errors.password && (
                <div className={styles.authError}>{errors.password}</div>
              )}
              {loginError && (
                <div className={styles.authError}>{loginError}</div>
              )}
              <Button
                variant="contained"
                color="primary"
                disabled={!isValid || isLoadingAuth}
                type="submit"
                fullWidth
                style={{ marginTop: "20px" }}
              >
                Login
              </Button>
              <span
                className={styles.authText}
                onClick={async () => {
                  await dispatch(resetOpenSignIn());
                  await dispatch(setOpenSignUp());
                }}
                style={{ marginTop: "20px" }}
              >
                You don't have an account?
              </span>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default SignInModal;
