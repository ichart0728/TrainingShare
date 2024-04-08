import React, { useState } from "react";
import styles from "./Post.module.css";

import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Divider, Checkbox } from "@material-ui/core";
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";

import AvatarGroup from "@material-ui/lab/AvatarGroup";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";

import { selectProfiles } from "../auth/authSlice";

import {
  selectComments,
  fetchPostStart,
  fetchPostEnd,
  fetchAsyncPostComment,
  fetchAsyncPatchLiked,
} from "./postSlice";

import {
  fetchAsyncGetProf,
  fetchAsyncGetUserPosts,
} from "../profile/profileSlice";

import { PROPS_POST } from "../types";

// https://v4.mui.com/components/avatars/#sizes
const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
}));

const Post: React.FC<PROPS_POST> = ({
  postId,
  loginId,
  userPost,
  title,
  imageUrl,
  liked,
}) => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const profiles = useSelector(selectProfiles);
  const comments = useSelector(selectComments);
  const [text, setText] = useState("");

  // 投稿に合致するコメントだけを取得
  // 全コメントを取得し、この投稿に対するコメントだけを表示
  // FIXME:全てのコメント情報を取得している前提の処理なので、必要最小限のデータだけ取得・表示するようにAPI含めて修正
  const commentsOnPost = comments.filter((com) => {
    return com.post === postId;
  });

  // 投稿したユーザーのプロフィールを取得
  const prof = profiles.filter((prof) => {
    return prof.userProfile === userPost;
  });

  const postComment = async (e: React.MouseEvent<HTMLElement>) => {
    // 投稿した時(フォームのデータを送信した時)のリフレッシュを無効化
    e.preventDefault();
    const packet = { text: text, post: postId };
    await dispatch(fetchPostStart());
    await dispatch(fetchAsyncPostComment(packet));
    await dispatch(fetchPostEnd());
    setText("");
  };

  const handlerLiked = async () => {
    const packet = {
      id: postId,
      title: title,
      current: liked,
      // ログインユーザーのID
      new: loginId,
    };
    await dispatch(fetchPostStart());
    await dispatch(fetchAsyncPatchLiked(packet));
    await dispatch(fetchPostEnd());
  };

  const navigate = useNavigate();

  const handleProfileClick = async (userId: string, nickName: string) => {
    await dispatch(fetchPostStart());
    await Promise.all([
      dispatch(fetchAsyncGetProf(userId)),
      dispatch(fetchAsyncGetUserPosts(userId)),
    ]);
    await dispatch(fetchPostEnd());
    navigate(`/profile/${nickName}`);
  };

  // タイトル(投稿)が存在する場合のみ表示
  if (title) {
    return (
      <div className={styles.post}>
        <div className={styles.post_header}>
          <Avatar className={styles.post_avatar} src={prof[0]?.img} />
          <h3
            onClick={() =>
              handleProfileClick(prof[0]?.userProfile, prof[0]?.nickName)
            }
            style={{ cursor: "pointer" }}
          >
            {prof[0]?.nickName}
          </h3>
        </div>
        <img className={styles.post_image} src={imageUrl} alt="" />

        <h4 className={styles.post_text}>
          {/* いいねボタン */}
          <Checkbox
            className={styles.post_checkBox}
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            checked={liked.some((like: string) => like === loginId)}
            onChange={handlerLiked}
          />
          <strong> {prof[0]?.nickName}</strong> {title}
          <AvatarGroup max={7}>
            {liked.map((like: string) => (
              <Avatar
                className={styles.post_avatarGroup}
                key={like}
                src={profiles.find((prof) => prof.userProfile === like)?.img}
              />
            ))}
          </AvatarGroup>
        </h4>

        <Divider />
        <div className={styles.post_comments}>
          {commentsOnPost.map((comment) => (
            <div key={comment.id} className={styles.post_comment}>
              <Avatar
                src={
                  // 全ユーザーのプロフィール情報からコメントをしたユーザーに合致するデータを見つけて、そのユーザーのプロフィール画像を表示

                  // FIXME
                  profiles.find(
                    (prof) => prof.userProfile === comment.userComment
                  )?.img
                }
                className={classes.small}
              />
              <p>
                <strong className={styles.post_strong}>
                  {
                    // FIXME
                    profiles.find(
                      (prof) => prof.userProfile === comment.userComment
                    )?.nickName
                  }
                </strong>
                {comment.text}
              </p>
            </div>
          ))}
        </div>

        <form className={styles.post_commentBox}>
          <input
            className={styles.post_input}
            type="text"
            placeholder="add a comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            // テキストが入力されていない場合は、ボタンを無効化
            disabled={!text.length}
            className={styles.post_button}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      </div>
    );
  }
  return null;
};

export default Post;
