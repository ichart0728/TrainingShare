import React from "react";
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Auth.module.css";
import ReactModal, { Styles } from "react-modal";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField, Button, CircularProgress } from "@material-ui/core";

// import { fetchAsyncGetPosts, fetchAsyncGetComments } from "../post/postSlice";

import {
  selectIsLoadingAuth,
  selectOpenSignIn,
  selectOpenSignUp,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  resetOpenSignUp,
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncLogin,
  fetchAsyncRegister,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
  fetchAsyncCreateProf,
} from "./authSlice";

const customStyles: ReactModal.Styles = {
  overlay: {
    backgroundColor: "#777777",
  },
  content: {
    top: "55%",
    left: "50%",

    width: 280,
    height: 350,
    padding: "50px",

    transform: "translate(-50%, -50%)",
  },
};

const Auth: React.FC = () => {
  ReactModal.setAppElement("#root");
  /*SelectorでStoreから状態を取得*/
  const openSignIn = useSelector(selectOpenSignIn);
  const openSignUp = useSelector(selectOpenSignUp);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  /*dispatchの実体を取得*/
  const dispatch: AppDispatch = useDispatch();

  return (
    <>
      <ReactModal
        /*サインアップ用モーダルの雛形を作成*/
        /*モーダルの状態*/
        isOpen={openSignUp}
        /*モーダル以外をクリックしたらモーダルを閉じる*/
        onRequestClose={async () => {
          await dispatch(resetOpenSignUp());
        }}
        /*モーダルのスタイルを定義*/
        style={customStyles}
      >
        <Formik
          /*初期状態はメールアドレスが入力されていないのでエラーとしておく*/
          initialErrors={{ email: "required" }}
          /*入力値を初期化*/
          initialValues={{ email: "", password: "" }}
          /*valuesにユーザーの入力値が入る*/
          onSubmit={async (values) => {
            /*ローディグスタート*/
            await dispatch(fetchCredStart());
            const resultReg = await dispatch(fetchAsyncRegister(values));

            /*新規ユーザー作成が正常に行われた場合*/
            if (fetchAsyncRegister.fulfilled.match(resultReg)) {
              await dispatch(fetchAsyncLogin(values));
              /*新規作成したユーザーのニックネームは初期値「anonymous」で登録*/
              await dispatch(fetchAsyncCreateProf({ nickName: "anonymous" }));

              await dispatch(fetchAsyncGetProfs());
              //   await dispatch(fetchAsyncGetPosts());
              //   await dispatch(fetchAsyncGetComments());
              await dispatch(fetchAsyncGetMyProf());
            }
            /*ローディグエンド*/
            await dispatch(fetchCredEnd());
            /*サインアップが完了したらモーダルを閉じる*/
            await dispatch(resetOpenSignUp());
          }}
          /*バリデーションを設定*/
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("email format is wrong")
              .required("email is must"),
            password: Yup.string().required("password is must").min(4),
          })}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            /*ユーザーが入力フォームに入力している値*/
            values,
            /*バリデーションエラーの場合のエラーメッセージ*/
            errors,
            /*モーダルにフォーカスが当たったらTrue*/
            touched,
            /*バリデーションに問題がない場合はTrue*/
            isValid,
          }) => (
            <div>
              <form onSubmit={handleSubmit}>
                <div className={styles.auth_signUp}>
                  <h1 className={styles.auth_title}>Training Share</h1>
                  <br />

                  <div className={styles.auth_progress}>
                    {/* ローディング中のアニメーションを表示 */}
                    {isLoadingAuth && <CircularProgress />}
                  </div>
                  <br />

                  <TextField
                    placeholder="email"
                    type="input"
                    name="email"
                    // ユーザーが何かしら入力したらバリデーションを実行
                    onChange={handleChange}
                    // ユーザーがフォームからフォーカスを外したらしたらバリデーションを実行
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  <br />
                  {/* エラーメッセージがある場合のみ表示、ない場合は何も表示しない(null) */}
                  {touched.email && errors.email ? (
                    <div className={styles.auth_error}>{errors.email}</div>
                  ) : null}

                  <TextField
                    placeholder="password"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  {touched.password && errors.password ? (
                    <div className={styles.auth_error}>{errors.password}</div>
                  ) : null}
                  <br />
                  <br />

                  <Button
                    variant="contained"
                    color="primary"
                    // バリデーションに問題がない場合のみ活性化
                    disabled={!isValid}
                    type="submit"
                  >
                    Register
                  </Button>
                  <br />
                  <br />
                  <span
                    className={styles.auth_text}
                    onClick={async () => {
                      await dispatch(setOpenSignIn());
                      await dispatch(resetOpenSignUp());
                    }}
                  >
                    You already have a account ?
                  </span>
                </div>
              </form>
            </div>
          )}
        </Formik>
      </ReactModal>

      <ReactModal
        /*サインイン用モーダルの雛形を作成*/
        isOpen={openSignIn}
        onRequestClose={async () => {
          await dispatch(resetOpenSignIn());
        }}
        style={customStyles}
      >
        <Formik
          initialErrors={{ email: "required" }}
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values) => {
            await dispatch(fetchCredStart());
            const result = await dispatch(fetchAsyncLogin(values));
            if (fetchAsyncLogin.fulfilled.match(result)) {
              await dispatch(fetchAsyncGetProfs());
              //   await dispatch(fetchAsyncGetPosts());
              //   await dispatch(fetchAsyncGetComments());
              await dispatch(fetchAsyncGetMyProf());
            }
            await dispatch(fetchCredEnd());
            await dispatch(resetOpenSignIn());
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("email format is wrong")
              .required("email is must"),
            password: Yup.string().required("password is must").min(4),
          })}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
            isValid,
          }) => (
            <div>
              <form onSubmit={handleSubmit}>
                <div className={styles.auth_signUp}>
                  <h1 className={styles.auth_title}>SNS clone</h1>
                  <br />
                  <div className={styles.auth_progress}>
                    {isLoadingAuth && <CircularProgress />}
                  </div>
                  <br />

                  <TextField
                    placeholder="email"
                    type="input"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />

                  {touched.email && errors.email ? (
                    <div className={styles.auth_error}>{errors.email}</div>
                  ) : null}
                  <br />

                  <TextField
                    placeholder="password"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  {touched.password && errors.password ? (
                    <div className={styles.auth_error}>{errors.password}</div>
                  ) : null}
                  <br />
                  <br />
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!isValid}
                    type="submit"
                  >
                    Login
                  </Button>
                  <br />
                  <br />
                  <span
                    className={styles.auth_text}
                    onClick={async () => {
                      await dispatch(resetOpenSignIn());
                      await dispatch(setOpenSignUp());
                    }}
                  >
                    You don't have a account ?
                  </span>
                </div>
              </form>
            </div>
          )}
        </Formik>
      </ReactModal>
    </>
  );
};

export default Auth;
