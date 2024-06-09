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
import { fetchAsyncGetPosts } from "../../api/postApi";
import { fetchAsyncGetComments } from "../../api/commentApi";
import {
  selectIsLoadingAuth,
  selectOpenSignUp,
  setOpenSignIn,
  resetOpenSignUp,
  fetchCredStart,
  fetchCredEnd,
} from "../../auth/authSlice";
import {
  fetchAsyncRegisterFirebase,
  fetchAsyncCreateProf,
  fetchAsyncGetProfs,
  fetchAsyncGetMyProf,
} from "../../api/authApi";

const SignUpModal: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const openSignUp = useSelector(selectOpenSignUp);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  const [signUpError, setSignUpError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Modal
      isOpen={openSignUp}
      onRequestClose={() => {}}
      shouldCloseOnOverlayClick={false}
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.modalContent}>
        <Formik
          initialErrors={{ email: "required" }}
          initialValues={{ email: "", password: "", confirmPassword: "" }}
          onSubmit={async (values) => {
            await dispatch(fetchCredStart());
            const resultReg = await dispatch(
              fetchAsyncRegisterFirebase(values)
            );
            if (fetchAsyncRegisterFirebase.fulfilled.match(resultReg)) {
              await dispatch(fetchAsyncCreateProf({ nickName: "anonymous" }));
              await dispatch(fetchAsyncGetProfs());
              await dispatch(fetchAsyncGetPosts());
              await dispatch(fetchAsyncGetComments());
              await dispatch(fetchAsyncGetMyProf());
              await dispatch(resetOpenSignUp());
              navigate("/workout_history");
            } else {
              if (
                resultReg.payload &&
                (resultReg.payload as { error: string }).error
              ) {
                setSignUpError((resultReg.payload as { error: string }).error);
              } else {
                setSignUpError(
                  "サインアップ中に予期しないエラーが発生しました。"
                );
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
            confirmPassword: Yup.string()
              .oneOf([Yup.ref("password")], "パスワードが一致しません。")
              .required("確認用パスワードは必須です。"),
          })}
        >
          {({ errors, touched, isValid, handleChange }) => (
            <Form className={styles.formContainer}>
              <h1 className={styles.authTitle}>FitTracker</h1>
              <div className={styles.authError}>{signUpError}</div>
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
                  setSignUpError("");
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
                  setSignUpError("");
                }}
              />
              <Field
                as={TextField}
                placeholder="確認用パスワード"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                      >
                        {showConfirmPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={
                  touched.confirmPassword &&
                  errors.confirmPassword !== undefined
                }
                helperText={
                  touched.confirmPassword && errors.confirmPassword
                    ? errors.confirmPassword
                    : " "
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                  setSignUpError("");
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
                新規登録
              </Button>
              <span
                className={styles.authText}
                onClick={async () => {
                  await dispatch(setOpenSignIn());
                  await dispatch(resetOpenSignUp());
                  setSignUpError("");
                }}
                style={{ marginTop: "20px" }}
              >
                アカウントをお持ちの方はこちら
              </span>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default SignUpModal;
