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

export interface PROPS_PUT_PROFILE {
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

interface PROPS_WORKOUT_SET {
  id: string;
  //重量
  weight: number;
  //回数
  reps: number;
  //完了したか
  completed: boolean;
}

// トレーニングメニューの型
export interface PROPS_WORKOUT_DISPLAY {
  id: string;
  // トレーニングメニュー
  menu: number;
  // 対象部位
  body_part: number;
  // セット
  sets: PROPS_WORKOUT_SET[];
}

export interface WORKOUT_POST {
  // ユーザーID
  date: string;
  // トレーニング時間
  duration: number;
  // トレーニングメニュー
  workouts: PROPS_WORKOUT_DISPLAY[];
}

interface PROPS_WORKOUT {
  id: string;
  menu: string;
  body_part: number;
  sets: PROPS_WORKOUT_SET[];
}

export interface PROPS_TRAINING_SESSION {
  id: string;
  date: string;
  duration: number;
  workouts: PROPS_WORKOUT[];
}

export interface PROPS_WORKOUT_CHART {
  trainingSessions: PROPS_TRAINING_SESSION[];
  trainingMenus: PROPS_TRAINING_MENU[];
}

export interface PROPS_LINE_CHART {
  trainingSessions: PROPS_TRAINING_SESSION[];
  trainingMenus: PROPS_TRAINING_MENU[];
  selectedTab: number;
  bodyPartColors: { [key: number]: string };
}

export interface PROPS_PIE_CHART {
  trainingSessions: PROPS_TRAINING_SESSION[];
  trainingMenus: PROPS_TRAINING_MENU[];
  bodyPartColors: { [key: number]: string };
}

export interface PROPS_RADAR_CHART {
  trainingSessions: PROPS_TRAINING_SESSION[];
  trainingMenus: PROPS_TRAINING_MENU[];
}

export interface PROPS_WORKOUT_HISTORY_STATE {
  trainingSessions: PROPS_TRAINING_SESSION[];
  loading: boolean;
  error: string | null;
}

// トレーニングメニュー全体の状態の型
export interface PROPS_WORKOUT_STATE {
  // トレーニングメニュー
  workouts: PROPS_WORKOUT_DISPLAY[];
  // トータルボリューム
  totalVolume: number;
  // 完了済みトータルボリューム
  completedTotalVolume: number;
  // タイマー
  timer: number;
  // タイマーの状態
  isActive: boolean;
  // タイマーが一時停止しているか
  isPaused: boolean;
}

interface PROPS_PROFILE {
  id: string;
  nickName: string;
  userProfile: string;
  created_on: string;
  img: string;
  userPosts: Post[];
}
interface UserPost {
  id: string;
  userPost: string;
  img: string;
  created_on: string;
}
export interface ProfileState {
  isLoadingProfile: boolean;
  profile: PROPS_PROFILE;
  userPosts: UserPost[];
}

export interface Training {
  id: number;
  name: string;
}
export interface PROPS_TRAINING_MENU {
  id: number;
  name: string;
  training_menus: Training[];
}

export interface PROPS_TRAINING_STATE {
  trainingMenus: PROPS_TRAINING_MENU[];
  isLoading: boolean;
}

interface Post {
  id: string;
  title: string;
  userPost: string;
  created_on: string;
  img: string;
  liked: string[];
}

interface Comment {
  id: string;
  text: string;
  userComment: string;
  post: string;
}

export interface PROPS_POST_STATE {
  /*投稿やコメントをfetchしている時のローディング制御*/
  isLoadingPost: boolean;
  /*新規投稿用モーダルの制御*/
  openNewPost: boolean;
  posts: Post[];
  comments: Comment[];
  profile: PROPS_PROFILE;
}

interface PROPS_MYPROFILE {
  id: string;
  nickName: string;
  userProfile: string;
  created_on: string;
  img: string;
}
interface PROPS_PROFILE {
  id: string;
  nickName: string;
  userProfile: string;
  created_on: string;
  img: string;
}

export interface PROPS_AUTH_STATE {
  /*サインイン用モーダル管理*/
  openSignIn: boolean;
  /*サインアップ用モーダル管理*/
  openSignUp: boolean;
  /*プロフィール用モーダル管理*/
  openProfile: boolean;
  /*ローディグ管理*/
  isLoadingAuth: boolean;
  /*ログインユーザーの状態*/
  myprofile: PROPS_MYPROFILE;
  /*プロフィール一覧格納用*/
  profiles: PROPS_PROFILE[];
}

export interface PROPS_WORKOUT_ITEM {
  workout: PROPS_WORKOUT_DISPLAY;
}
