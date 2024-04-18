import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import StyledBadge from "../home/StyledBadge";
import {
  editNickname,
  selectMyProfile,
  setOpenSignIn,
  resetOpenProfile,
  logout,
} from "../auth/authSlice";
import { resetOpenNewPost } from "../post/postSlice";
import {
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import CalendarToday from "@material-ui/icons/CalendarToday";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import FitnessCenter from "@material-ui/icons/FitnessCenter";
import styles from "./Sidebar.module.css";
import { useNavigate } from "react-router-dom";
import { setUserProfileId } from "../profile/profileSlice";

const Sidebar = () => {
  const dispatch: AppDispatch = useDispatch();
  const myprofile = useSelector(selectMyProfile);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleHomeClick = () => {
    navigate("/");
    setMobileOpen(false);
  };

  const handleMyProfileClick = () => {
    dispatch(setUserProfileId(myprofile.userProfile));
    navigate(`profile/${myprofile.nickName}`);
    setMobileOpen(false);
  };

  const handleWorkoutClick = () => {
    navigate("/workout");
    setMobileOpen(false);
  };

  const handleCalendarClick = () => {
    navigate("/workout");
    setMobileOpen(false);
  };

  const handleLogoutClick = () => {
    const confirmLogout = window.confirm("ログアウトしますか？");
    if (confirmLogout) {
      localStorage.removeItem("localJWT");
      dispatch(resetOpenProfile());
      dispatch(resetOpenNewPost());
      dispatch(setOpenSignIn());
      dispatch(logout());
      navigate("/");
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        className={styles.menuButton}
      >
        <MenuIcon className={styles.icon} />
      </IconButton> */}
      <div className={styles.menuButtonWrapper}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          className={styles.menuButton}
        >
          <MenuIcon className={styles.icon} />
        </IconButton>
      </div>
      <Drawer
        className={styles.drawer}
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        classes={{
          paper: styles.drawerContent,
        }}
      >
        <div className={styles.drawerHeader}>
          <h1 className={styles.sidebar_title}>Training Share</h1>
        </div>
        <List className={styles.drawerContent}>
          <ListItem button key="Home" onClick={handleHomeClick}>
            <ListItemIcon>
              <div className={styles.iconWrapper}>
                <HomeIcon className={styles.icon} />
              </div>
            </ListItemIcon>
            <ListItemText primary="Home" className={styles.listItemText} />
          </ListItem>

          <ListItem button key="Workout" onClick={handleWorkoutClick}>
            <ListItemIcon>
              <div className={styles.iconWrapper}>
                <FitnessCenter className={styles.icon} />
              </div>
            </ListItemIcon>
            <ListItemText primary="Workout" className={styles.listItemText} />{" "}
          </ListItem>

          <ListItem button key="Calendar" onClick={handleCalendarClick}>
            <ListItemIcon>
              <div className={styles.iconWrapper}>
                <CalendarToday className={styles.icon} />
              </div>
            </ListItemIcon>
            <ListItemText primary="Calendar" className={styles.listItemText} />{" "}
          </ListItem>

          <ListItem button key="Profile" onClick={handleMyProfileClick}>
            <ListItemIcon>
              <div className={styles.iconWrapper}>
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
              </div>
            </ListItemIcon>
            <ListItemText primary="Profile" className={styles.listItemText} />
          </ListItem>

          <ListItem button key="Logout" onClick={handleLogoutClick}>
            <ListItemIcon>
              <div className={styles.iconWrapper}>
                <ExitToAppIcon className={styles.icon} />
              </div>
            </ListItemIcon>
            <ListItemText primary="Logout" className={styles.listItemText} />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;