import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { PROPS_AUTHEN, PROPS_PUT_PROFILE, PROPS_NICKNAME } from "../types";
import { getAuth } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../app/firebase";
import { FirebaseError } from "firebase/app";
const apiUrl = process.env.REACT_APP_DEV_API_URL;

export const fetchAsyncSignInFirebase = createAsyncThunk(
  "auth/signInFirebase",
  async (values: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;
      console.log(userCredential);
      return { email: user.email };
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof FirebaseError) {
        if (error.code === "auth/invalid-email") {
          return rejectWithValue({ error: "無効なメールアドレスです。" });
        } else {
          return rejectWithValue({
            error: "メールアドレスまたはパスワードが間違っています",
          });
        }
      }
    }
  }
);

export const fetchAsyncSendPasswordResetEmail = createAsyncThunk(
  "auth/sendPasswordResetEmail",
  async (email: string, { rejectWithValue }) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { message: "パスワード再設定のメールを送信しました。" };
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof FirebaseError) {
        if (error.code === "auth/invalid-email") {
          return rejectWithValue({ error: "無効なメールアドレスです。" });
        } else if (error.code === "auth/user-not-found") {
          return rejectWithValue({
            error: "このメールアドレスは登録されていません。",
          });
        } else {
          return rejectWithValue({
            error: "パスワード再設定のメール送信中にエラーが発生しました。",
          });
        }
      }
    }
  }
);

/*ユーザー新規作成（Firebaseを使用）*/
export const fetchAsyncRegisterFirebase = createAsyncThunk(
  "auth/registerFirebase",
  async (values: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;
      console.log(userCredential);
      const idToken = await user.getIdToken();
      const res = await axios.post(
        `${apiUrl}api/firebase-register/`,
        { token: idToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          return rejectWithValue({
            error: "このメールアドレスは既に登録されています。",
          });
        } else if (error.code === "auth/invalid-email") {
          return rejectWithValue({ error: "無効なメールアドレスです。" });
        } else if (error.code === "auth/weak-password") {
          return rejectWithValue({
            error: "パスワードは6文字以上で設定してください。",
          });
        } else {
          return rejectWithValue({
            error: "サインアップ中にエラーが発生しました。",
          });
        }
      }
    }
  }
);

/*ユーザー新規作成*/
export const fetchAsyncRegister = createAsyncThunk(
  "auth/register",
  async (auth: PROPS_AUTHEN, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${apiUrl}api/register/`, auth, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data);
      }
      throw err;
    }
  }
);

/*プロフィール新規作成*/
export const fetchAsyncCreateProf = createAsyncThunk(
  "profile/post",
  async (nickName: PROPS_NICKNAME) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();

      const res = await axios.post(`${apiUrl}api/profiles/`, nickName, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return res.data;
    } else {
      throw new Error("User not authenticated");
    }
  }
);

/*プロフィール更新*/
export const fetchAsyncUpdateProf = createAsyncThunk(
  "profile/put",
  async (profile: PROPS_PUT_PROFILE) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();

      const uploadData = new FormData();
      uploadData.append("nickName", profile.nickName);
      profile.img && uploadData.append("img", profile.img, profile.img.name);
      const res = await axios.put(
        `${apiUrl}api/profile/${profile.id}/`,
        uploadData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data;
    } else {
      throw new Error("User not authenticated");
    }
  }
);

/*プロフィール取得*/
export const fetchAsyncGetMyProf = createAsyncThunk(
  "myprofile/get",
  async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();

      const res = await axios.get(`${apiUrl}api/profiles/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return res.data[0];
    } else {
      throw new Error("User not authenticated");
    }
  }
);

/*プロフィール一覧取得*/
export const fetchAsyncGetProfs = createAsyncThunk("profiles/get", async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();

    const res = await axios.get(`${apiUrl}api/profiles/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return res.data;
  } else {
    throw new Error("User not authenticated");
  }
});
