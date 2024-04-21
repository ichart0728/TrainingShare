/*インターフェースの型を定義*/
export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}

/*authSlice.ts*/
export interface PROPS_AUTHEN {
  email: string;
  password: string;
}

export interface PROPS_PROFILE {
  id: string;
  nickName: string;
  img: File | null;
}

export interface PROPS_NICKNAME {
  nickName: string;
}

/*postSlice.ts*/
export interface PROPS_NEWPOST {
  title: string;
  img: File | null;
}

export interface PROPS_LIKED {
  id: string;
  title: string;
  current: string[];
  new: string;
}

export interface PROPS_COMMENT {
  text: string;
  post: string;
}

/*Post.tsx*/
export interface PROPS_POST {
  postId: string;
  loginId: string;
  userPost: string;
  title: string;
  imageUrl: string;
  liked: string[];
}

interface WorkoutSet {
  //重量
  weight: number;
  //回数
  reps: number;
  //完了したか
  completed: boolean;
}

// トレーニングメニューの型
export interface WorkoutDisplay {
  // トレーニングメニュー
  menu: number;
  // 対象部位
  body_part: number;
  // セット
  sets: WorkoutSet[];
}

export interface WORKOUT_POST {
  // ユーザーID
  date: string;
  // トレーニング時間
  duration: number;
  // トレーニングメニュー
  workouts: WorkoutDisplay[];
}
