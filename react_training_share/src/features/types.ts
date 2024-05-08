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

export interface WORKOUT_POST {
  // ユーザーID
  date: string;
  // トレーニング時間
  duration: number;
  // トレーニングメニュー
  workouts: PROPS_WORKOUT[];
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

export interface PROPS_WORKOUT {
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

export interface PROPS_TIMER {
  // タイマーが動いているか
  active: boolean;
  // タイマーが一時停止中か
  paused: boolean;
  // タイマーの開始時間
  startTime: number;
  // タイマーが一時停止された時刻
  pausedTime: number;
  // タイマーの経過時間
  elapsedTime: number;
}

// トレーニングメニュー全体の状態の型
export interface PROPS_WORKOUT_STATE {
  // トレーニングメニュー
  workouts: PROPS_WORKOUT[];
  // トータルボリューム
  totalVolume: number;
  // 完了済みトータルボリューム
  completedTotalVolume: number;
  // タイマー
  timer: PROPS_TIMER;
}

interface PROPS_PROFILE {
  id: string;
  nickName: string;
  userProfile: string;
  created_on: string;
  img: string;
  gender: string;
  height: number;
  dateOfBirth: string;
  userPosts: Post[];
}
interface UserPost {
  id: string;
  userPost: string;
  img: string;
  created_on: string;
}

interface WeightHistory {
  date: string;
  weight: number;
}

interface muscleMassHistory {
  date: string;
  muscleMass: number;
}

interface BodyFatPercentageHistory {
  date: string;
  bodyFatPercentage: number;
}

export interface ProfileState {
  isLoadingProfile: boolean;
  profile: PROPS_PROFILE;
  weightHistory: WeightHistory[];
  bodyFatPercentageHistory: BodyFatPercentageHistory[];
  muscleMassHistory: muscleMassHistory[];
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
  gender: string;
  height: number;
  dateOfBirth: string;
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
  workout: PROPS_WORKOUT;
}
