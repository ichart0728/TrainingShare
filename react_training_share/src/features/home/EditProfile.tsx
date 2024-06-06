import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./Home.module.css";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";

import { File } from "../types";

import {
  editNickname,
  selectMyProfile,
  selectOpenProfile,
  resetOpenProfile,
  fetchCredStart,
  fetchCredEnd,
} from "../auth/authSlice";

import { fetchAsyncUpdateProf } from "../api/authApi";

import { Button, TextField, IconButton } from "@material-ui/core";
import { MdAddAPhoto } from "react-icons/md";

// モーダルのスタイル
const customStyles = {
  content: {
    top: "55%",
    left: "50%",

    width: 280,
    height: 220,
    padding: "50px",

    transform: "translate(-50%, -50%)",
  },
};

const EditProfile: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const openProfile = useSelector(selectOpenProfile);
  const profile = useSelector(selectMyProfile);
  const [image, setImage] = useState<File | null>(null);

  // プロフィールの更新処理
  const updateProfile = async (e: React.MouseEvent<HTMLElement>) => {
    // 画面のリフレッシュを防ぐ
    e.preventDefault();
    const packet = { id: profile.id, nickName: profile.nickName, img: image };

    await dispatch(fetchCredStart());
    await dispatch(fetchAsyncUpdateProf(packet));
    await dispatch(fetchCredEnd());
    await dispatch(resetOpenProfile());
  };

  const handlerEditPicture = () => {
    // id: imageInputを持つ要素をクリックする
    const fileInput = document.getElementById("imageInput");
    fileInput?.click();
  };

  return (
    <>
      {/* モーダルのテンプレート */}
      <Modal
        isOpen={openProfile}
        onRequestClose={async () => {
          await dispatch(resetOpenProfile());
        }}
        style={customStyles}
      >
        <form className={styles.core_signUp}>
          <h1 className={styles.core_title}>FitTracker</h1>

          <br />
          <TextField
            placeholder="nickname"
            type="text"
            value={profile?.nickName}
            // ニックネームが変更されたら,dispatchでstore内のニックネームを更新
            onChange={(e) => dispatch(editNickname(e.target.value))}
          />

          <input
            type="file"
            id="imageInput"
            // HTMLのinputは非表示にしておく
            hidden={true}
            // 変更が加わったら画像をstateにセット
            onChange={(e) => setImage(e.target.files![0])}
          />
          <br />
          {/*AddPhotoがクリックされたときに、id="imageInput"の要素をクリックする*/}
          <IconButton onClick={handlerEditPicture}>
            <MdAddAPhoto />
          </IconButton>
          <br />
          <Button
            // ニックネームが空の時は更新ボタンを非活性化
            disabled={!profile?.nickName}
            variant="contained"
            color="primary"
            type="submit"
            onClick={updateProfile}
          >
            Update
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default EditProfile;
