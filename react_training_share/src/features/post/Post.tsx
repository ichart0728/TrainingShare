import React, { useState } from "react";
import styles from "./Post.module.css";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Checkbox } from "@material-ui/core";
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { selectProfiles } from "../auth/authSlice";
import { selectComments, fetchPostStart, fetchPostEnd } from "./postSlice";
import { fetchAsyncPostComment, fetchAsyncPatchLiked } from "../api/postApi";
import { setUserProfileId } from "../profile/profileSlice";
import { PROPS_POST } from "../types";

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
  const [showAllComments, setShowAllComments] = useState(false);

  const commentsOnPost = comments.filter((com) => com.post === postId);
  const prof = profiles.filter((prof) => prof.userProfile === userPost);

  const postComment = async (e: React.MouseEvent<HTMLElement>) => {
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
      new: loginId,
    };
    await dispatch(fetchPostStart());
    await dispatch(fetchAsyncPatchLiked(packet));
    await dispatch(fetchPostEnd());
  };

  const navigate = useNavigate();

  const handleProfileClick = async (userId: string, nickName: string) => {
    dispatch(setUserProfileId(userId));
    navigate(`/profile/${nickName}`);
  };

  const toggleCommentsVisibility = () => {
    setShowAllComments(!showAllComments);
  };

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
      <div className={styles.post_content}>
        <div className={styles.post_info}>
          <Checkbox
            className={styles.post_checkBox}
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            checked={liked.some((like) => like === loginId)}
            onChange={handlerLiked}
          />
          <strong className={styles.post_nickName}>{prof[0]?.nickName}</strong>{" "}
          {title}
          <AvatarGroup max={7}>
            {liked.map((like) => (
              <Avatar
                key={like}
                src={profiles.find((prof) => prof.userProfile === like)?.img}
                className={styles.post_avatar}
              />
            ))}
          </AvatarGroup>
        </div>
        {!showAllComments && (
          <p
            onClick={toggleCommentsVisibility}
            style={{ color: "gray", cursor: "pointer" }}
          >
            View all comments
          </p>
        )}
      </div>

      {showAllComments && (
        <div>
          <div className={styles.post_comments}>
            {commentsOnPost.map((comment) => (
              <div key={comment.id} className={styles.post_comment}>
                <Avatar
                  src={
                    profiles.find(
                      (prof) => prof.userProfile === comment.userComment
                    )?.img
                  }
                  className={classes.small}
                />
                <p>
                  <strong>
                    {
                      profiles.find(
                        (prof) => prof.userProfile === comment.userComment
                      )?.nickName
                    }
                  </strong>
                  {comment.text}
                </p>
              </div>
            ))}
            <p
              onClick={toggleCommentsVisibility}
              style={{ color: "gray", cursor: "pointer" }}
            >
              Hide all comments
            </p>
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
              disabled={!text.length}
              className={styles.post_button}
              type="submit"
              onClick={postComment}
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Post;
