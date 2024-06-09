import React from "react";
import { AppDispatch } from "../../../app/store";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Modal.module.css";
import Modal from "react-modal";
import { TextField, Button, CircularProgress } from "@material-ui/core";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import {
  setOpenSignIn,
  selectIsLoadingAuth,
  selectOpenForgotPassword,
  resetOpenForgotPassword,
  setOpenForgotPasswordConfirmation,
  fetchCredStart,
  fetchCredEnd,
} from "../../auth/authSlice";
import { fetchAsyncSendPasswordResetEmail } from "../../api/authApi";

const ForgotPasswordModal: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const openForgotPassword = useSelector(selectOpenForgotPassword);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);

  const handleForgotPassword = async (email: string) => {
    await dispatch(fetchCredStart());
    await dispatch(fetchAsyncSendPasswordResetEmail(email));
    await dispatch(resetOpenForgotPassword());
    await dispatch(setOpenForgotPasswordConfirmation());
    await dispatch(fetchCredEnd());
  };

  return (
    <Modal
      isOpen={openForgotPassword}
      onRequestClose={() => {}}
      shouldCloseOnOverlayClick={false}
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.authTitle}>パスワードを忘れた場合</h2>
        <div className={styles.authProgress}>
          {isLoadingAuth && <CircularProgress />}
        </div>
        <Formik
          initialValues={{ email: "" }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("メールアドレスの形式が正しくありません。")
              .required("メールアドレスは必須です。"),
          })}
          onSubmit={async (values) => {
            await handleForgotPassword(values.email);
          }}
        >
          {({ errors, touched }) => (
            <Form className={styles.formContainer}>
              <Field
                as={TextField}
                name="email"
                label="メールアドレス"
                type="email"
                fullWidth
                margin="normal"
                error={touched.email && errors.email !== undefined}
                helperText={touched.email && errors.email ? errors.email : " "}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isLoadingAuth}
                fullWidth
                style={{ marginTop: "20px" }}
              >
                パスワードをリセットする
              </Button>
              <span
                className={styles.authText}
                onClick={async () => {
                  await dispatch(setOpenSignIn());
                  await dispatch(resetOpenForgotPassword());
                }}
                style={{ marginTop: "20px" }}
              >
                ログイン画面に戻る
              </span>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default ForgotPasswordModal;
