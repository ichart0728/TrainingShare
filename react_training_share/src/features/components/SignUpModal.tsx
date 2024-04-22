import React, { useState } from "react";
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Modal.module.css";
import Modal from "react-modal";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { TextField, Button, CircularProgress } from "@material-ui/core";
import { fetchAsyncGetPosts } from "../api/postApi";
import { fetchAsyncGetComments } from "../api/commentApi";

import {
  selectIsLoadingAuth,
  selectOpenSignUp,
  setOpenSignIn,
  resetOpenSignUp,
  fetchCredStart,
  fetchCredEnd,
} from "../auth/authSlice";
import {
  fetchAsyncLogin,
  fetchAsyncRegister,
  fetchAsyncCreateProf,
  fetchAsyncGetProfs,
  fetchAsyncGetMyProf,
} from "../api/authApi";

const SignUpModal: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const openSignUp = useSelector(selectOpenSignUp);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  const [signUpError, setSignUpError] = useState("");

  return (
    <Modal
      isOpen={openSignUp}
      onRequestClose={async () => {
        await dispatch(resetOpenSignUp());
        setSignUpError("");
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
            const resultReg = await dispatch(fetchAsyncRegister(values));
            if (fetchAsyncRegister.fulfilled.match(resultReg)) {
              await dispatch(fetchAsyncLogin(values));
              await dispatch(fetchAsyncCreateProf({ nickName: "anonymous" }));
              await dispatch(fetchAsyncGetProfs());
              await dispatch(fetchAsyncGetPosts());
              await dispatch(fetchAsyncGetComments());
              await dispatch(fetchAsyncGetMyProf());
              await dispatch(resetOpenSignUp());
            } else {
              if (
                resultReg.payload &&
                (resultReg.payload as { email?: string }).email
              ) {
                setSignUpError("This email is already registered");
              } else {
                setSignUpError("Error occurred during sign up");
              }
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
              {signUpError && (
                <div className={styles.authError}>{signUpError}</div>
              )}
              <Button
                variant="contained"
                color="primary"
                disabled={!isValid || isLoadingAuth}
                type="submit"
                fullWidth
                style={{ marginTop: "20px" }}
              >
                Register
              </Button>
              <span
                className={styles.authText}
                onClick={async () => {
                  await dispatch(setOpenSignIn());
                  await dispatch(resetOpenSignUp());
                }}
                style={{ marginTop: "20px" }}
              >
                You already have an account?
              </span>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default SignUpModal;
