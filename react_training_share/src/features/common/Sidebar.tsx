import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import StyledBadge from "../home/StyledBadge";
import {
  editNickname,
  selectMyProfile,
  setOpenSignIn,
  resetOpenProfile,
} from "../auth/authSlice";
import { resetOpenNewPost } from "../post/postSlice";
import {
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import styles from "./Sidebar.module.css"; // CSSモジュールのインポート

import { useNavigate } from "react-router-dom";
import { setUserProfileId } from "../profile/profileSlice";

const Sidebar = () => {
  const dispatch: AppDispatch = useDispatch();
  const myprofile = useSelector(selectMyProfile);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleMyProfileClick = () => {
    dispatch(setUserProfileId(myprofile.userProfile));
    navigate(`profile/${myprofile.nickName}`);
  };
  const handleLogoutClick = () => {
    // ログアウトしたらJWTトークンを削除
    localStorage.removeItem("localJWT");
    // dispatchでstoreを初期化
    dispatch(editNickname(""));
    dispatch(resetOpenProfile());
    dispatch(resetOpenNewPost());
    dispatch(setOpenSignIn());
    navigate("/");
  };
  return (
    <Drawer className={styles.drawer} variant="permanent" anchor="left">
      <div className={styles.drawerHeader}>
        <h1 className={styles.sidebar_title}>Training Share</h1>
      </div>
      <List className={styles.drawerContent}>
        {/* Repeat ListItem for each icon */}
        <ListItem button key="Home" onClick={handleHomeClick}>
          <ListItemIcon>
            <HomeIcon className={(styles.icon, "icon")} />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button key="Profile" onClick={handleMyProfileClick}>
          <ListItemIcon>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              <Avatar
                className={styles.avatar}
                alt="who?"
                src={myprofile.img}
              />
            </StyledBadge>
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button key="Logout" onClick={handleLogoutClick}>
          <ListItemIcon>
            <ExitToAppIcon className={(styles.icon, "icon")} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
        {/* ... other list items */}
      </List>
    </Drawer>
  );
};

export default Sidebar;
