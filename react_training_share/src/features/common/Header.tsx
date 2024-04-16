import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { Avatar, Button, CircularProgress } from "@material-ui/core";
import StyledBadge from "../home/StyledBadge";
import {
  editNickname,
  selectMyProfile,
  selectIsLoadingAuth,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  resetOpenSignUp,
  setOpenProfile,
  resetOpenProfile,
} from "../auth/authSlice";

import styles from "./Header.module.css"; // ヘッダー用のCSS

import { MdAddAPhoto } from "react-icons/md";

import {
  selectIsLoadingPost,
  setOpenNewPost,
  resetOpenNewPost,
} from "../post/postSlice";

const Header = () => {
  const dispatch: AppDispatch = useDispatch();
  const profile = useSelector(selectMyProfile);
  const isLoadingPost = useSelector(selectIsLoadingPost);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  return (
    <div className={styles.header}>
      <div className={styles.core_header}>
        <h1 className={styles.core_title}>Training Share</h1>
        {/* プロフィールが存在する場合はニックネームを確認 */}
        {/* ニックネームが存在する場合はログイン済みと判定 */}
        {profile?.nickName ? (
          <>
            <button
              className={styles.core_btnModal}
              onClick={() => {
                dispatch(setOpenNewPost());
                dispatch(resetOpenProfile());
              }}
            >
              <MdAddAPhoto />
            </button>
            <div className={styles.core_logout}>
              {(isLoadingPost || isLoadingAuth) && <CircularProgress />}
              <Button
                onClick={() => {
                  // ログアウトしたらJWTトークンを削除
                  localStorage.removeItem("localJWT");
                  // dispatchでstoreを初期化
                  dispatch(editNickname(""));
                  dispatch(resetOpenProfile());
                  dispatch(resetOpenNewPost());
                  dispatch(setOpenSignIn());
                }}
              >
                Logout
              </Button>
              <button
                className={styles.core_btnModal}
                onClick={() => {
                  dispatch(setOpenProfile());
                  dispatch(resetOpenNewPost());
                }}
              >
                {/* https://v4.mui.com/components/avatars/#BadgeAvatars.js */}
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  variant="dot"
                >
                  <Avatar alt="who?" src={profile.img} />{" "}
                </StyledBadge>
              </button>
            </div>
          </>
        ) : (
          // ニックネームが存在しない場合はログインボタン、サインアップボタン、ログインモーダルを表示
          <div>
            <Button
              onClick={() => {
                dispatch(setOpenSignIn());
                dispatch(resetOpenSignUp());
              }}
            >
              LogIn
            </Button>
            <Button
              onClick={() => {
                dispatch(setOpenSignUp());
                dispatch(resetOpenSignIn());
              }}
            >
              SignUp
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
