import React, { useState } from "react";
import { AppDispatch } from "../../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./Modal.module.css";
import Modal from "react-modal";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { fetchAsyncGetTrainingMenus } from "../../api/trainingMenuApi";
import { fetchAsyncGetTrainingSessions } from "../../api/workoutApi";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "../../types";
import {
  selectIsLoadingAuth,
  selectOpenSignIn,
  setOpenSignUp,
  setOpenForgotPassword,
  resetOpenSignIn,
  fetchCredStart,
  fetchCredEnd,
} from "../../auth/authSlice";
import {
  fetchAsyncSignInFirebase,
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
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Modal
      isOpen={openSignIn}
      onRequestClose={() => {}}
      shouldCloseOnOverlayClick={false}
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.modalContent}>
        <Formik
          initialErrors={{ email: "required" }}
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values) => {
            await dispatch(fetchCredStart());
            const resultSignIn = await dispatch(
              fetchAsyncSignInFirebase(values)
            );

            if (fetchAsyncSignInFirebase.fulfilled.match(resultSignIn)) {
              await dispatch(fetchAsyncGetProfs());
              await dispatch(fetchAsyncGetMyProf());
              await dispatch(fetchAsyncGetMyProf());
              await dispatch(fetchAsyncGetTrainingMenus());
              await dispatch(fetchAsyncGetTrainingSessions());
              await dispatch(resetOpenSignIn());
              navigate("/workout_history");
            } else {
              if (
                resultSignIn.payload &&
                (resultSignIn.payload as { error: string }).error
              ) {
                setLoginError(
                  (resultSignIn.payload as { error: string }).error
                );
              } else {
                setLoginError("サインイン中に予期しないエラーが発生しました。");
              }
            }
            await dispatch(fetchCredEnd());
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("メールアドレスの形式が正しくありません。")
              .required("メールアドレスは必須です。"),
            password: Yup.string()
              .required("パスワードは必須です。")
              .min(6, "パスワードは6文字以上で入力してください。"),
          })}
        >
          {({ errors, touched, isValid, handleChange }) => (
            <Form className={styles.formContainer}>
              <h1 className={styles.authTitle}>FitTracker</h1>
              <div className={styles.authError}>{loginError}</div>
              <div className={styles.authProgress}>
                {isLoadingAuth && <CircularProgress />}
              </div>
              <Field
                as={TextField}
                placeholder="メールアドレス"
                type="input"
                name="email"
                fullWidth
                margin="normal"
                error={touched.email && errors.email !== undefined}
                helperText={touched.email && errors.email ? errors.email : " "}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                  setLoginError("");
                }}
              />
              <Field
                as={TextField}
                placeholder="パスワード"
                type={showPassword ? "text" : "password"}
                name="password"
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={touched.password && errors.password !== undefined}
                helperText={
                  touched.password && errors.password ? errors.password : " "
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                  setLoginError("");
                }}
              />
              <Button
                variant="contained"
                color="primary"
                disabled={!isValid || isLoadingAuth}
                type="submit"
                fullWidth
                style={{ marginTop: "20px" }}
              >
                ログイン
              </Button>
              <span
                className={styles.authText}
                onClick={async () => {
                  await dispatch(resetOpenSignIn());
                  await dispatch(setOpenSignUp());
                  setLoginError("");
                }}
                style={{ marginTop: "20px" }}
              >
                アカウントをお持ちでない方はこちら
              </span>
              <span
                className={styles.forgotPassword}
                onClick={async () => {
                  await dispatch(resetOpenSignIn());
                  await dispatch(setOpenForgotPassword());
                  setLoginError("");
                }}
              >
                パスワードをお忘れの方はこちら
              </span>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default SignInModal;
