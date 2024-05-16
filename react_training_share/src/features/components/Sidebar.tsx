import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  selectMyProfile,
  setOpenSignIn,
  resetOpenProfile,
  logout,
} from "../auth/authSlice";
import { resetOpenNewPost } from "../post/postSlice";
import {
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
  BottomNavigation,
  BottomNavigationAction,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import HomeIcon from "@material-ui/icons/Home";
import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import FitnessCenterOutlinedIcon from "@material-ui/icons/FitnessCenterOutlined";
import FitnessCenterIcon from "@material-ui/icons/FitnessCenter";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import PersonIcon from "@material-ui/icons/Person";
import styles from "./Sidebar.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { setUserProfileId } from "../profile/profileSlice";
import ConfirmationDialog from "../components/ConfirmationDialog";

const Sidebar = () => {
  const dispatch: AppDispatch = useDispatch();
  const myprofile = useSelector(selectMyProfile);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const handleCloseLogoutModal = () => {
    setOpenLogoutModal(false);
  };
  const handleConfirmLogout = () => {
    localStorage.removeItem("localJWT");
    dispatch(resetOpenProfile());
    dispatch(resetOpenNewPost());
    dispatch(setOpenSignIn());
    dispatch(logout());
    navigate("/");
    setMobileOpen(false);
    setOpenLogoutModal(false);
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleHomeClick = () => {
    navigate("/workout_history");
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
    navigate("/calendar");
    setMobileOpen(false);
  };

  const handleLogoutClick = () => {
    setOpenLogoutModal(true);
  };

  const isSelected = (path: string) => {
    return location.pathname === path;
  };

  const sidebarContent = (
    <List className={styles.drawerContent}>
      <ListItem
        button
        key="Home"
        onClick={handleHomeClick}
        className={isSelected("/workout_history") ? styles.selected : ""}
      >
        <ListItemIcon>
          <div className={styles.iconWrapper}>
            {isSelected("/workout_history") ? (
              <HomeIcon className={styles.icon} />
            ) : (
              <HomeOutlinedIcon className={styles.icon} />
            )}
          </div>
        </ListItemIcon>
        <ListItemText primary="Home" className={styles.listItemText} />
      </ListItem>

      <ListItem
        button
        key="Workout"
        onClick={handleWorkoutClick}
        className={isSelected("/workout") ? styles.selected : ""}
      >
        <ListItemIcon>
          <div className={styles.iconWrapper}>
            {isSelected("/workout") ? (
              <FitnessCenterIcon className={styles.icon} />
            ) : (
              <FitnessCenterOutlinedIcon className={styles.icon} />
            )}
          </div>
        </ListItemIcon>
        <ListItemText primary="Workout" className={styles.listItemText} />
      </ListItem>

      <ListItem
        button
        key="Calendar"
        onClick={handleCalendarClick}
        className={isSelected("/calendar") ? styles.selected : ""}
      >
        <ListItemIcon>
          <div className={styles.iconWrapper}>
            {isSelected("/calendar") ? (
              <CalendarTodayIcon className={styles.icon} />
            ) : (
              <CalendarTodayOutlinedIcon className={styles.icon} />
            )}
          </div>
        </ListItemIcon>
        <ListItemText primary="Calendar" className={styles.listItemText} />
      </ListItem>

      <ListItem
        button
        key="Profile"
        onClick={handleMyProfileClick}
        className={
          isSelected(`/profile/${myprofile.nickName}`) ? styles.selected : ""
        }
      >
        <ListItemIcon>
          <div className={styles.iconWrapper}>
            {isSelected(`/profile/${myprofile.nickName}`) ? (
              <PersonIcon className={styles.PersonIcon} />
            ) : (
              <PersonOutlineIcon className={styles.PersonIcon} />
            )}
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
  );

  if (isMobile) {
    return (
      <>
        <BottomNavigation className={styles.bottomNavigation}>
          <BottomNavigationAction
            label="Home"
            icon={
              isSelected("/workout_history") ? (
                <HomeIcon className={styles.mobileIcon} />
              ) : (
                <HomeOutlinedIcon className={styles.mobileIcon} />
              )
            }
            onClick={handleHomeClick}
            className={isSelected("/workout_history") ? styles.selected : ""}
          />
          <BottomNavigationAction
            label="Workout"
            icon={
              isSelected("/workout") ? (
                <FitnessCenterIcon className={styles.mobileIcon} />
              ) : (
                <FitnessCenterOutlinedIcon className={styles.mobileIcon} />
              )
            }
            onClick={handleWorkoutClick}
            className={isSelected("/workout") ? styles.selected : ""}
          />
          <BottomNavigationAction
            label="Calendar"
            icon={
              isSelected("/calendar") ? (
                <CalendarTodayIcon className={styles.mobileIcon} />
              ) : (
                <CalendarTodayOutlinedIcon className={styles.mobileIcon} />
              )
            }
            onClick={handleCalendarClick}
            className={isSelected("/calendar") ? styles.selected : ""}
          />
          <BottomNavigationAction
            label="Profile"
            icon={
              isSelected(`/profile/${myprofile.nickName}`) ? (
                <PersonIcon className={styles.mobilePersonIcon} />
              ) : (
                <PersonOutlineIcon className={styles.mobilePersonIcon} />
              )
            }
            onClick={handleMyProfileClick}
            className={
              isSelected(`/profile/${myprofile.nickName}`)
                ? styles.selected
                : ""
            }
          />
          <BottomNavigationAction
            label="Logout"
            icon={<ExitToAppIcon className={styles.mobileIcon} />}
            onClick={handleLogoutClick}
          />
        </BottomNavigation>
        <ConfirmationDialog
          open={openLogoutModal}
          onClose={handleCloseLogoutModal}
          title="ログアウトしますか？"
          content="ログアウトしますか？"
          cancelText="キャンセル"
          confirmText="ログアウト"
          onCancel={handleCloseLogoutModal}
          onConfirm={handleConfirmLogout}
        />
      </>
    );
  }

  return (
    <>
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
        variant="permanent"
        open
        classes={{
          paper: styles.drawerContent,
        }}
      >
        <div className={styles.drawerHeader}>
          <h1 className={styles.sidebar_title}>Training Share</h1>
        </div>
        {sidebarContent}
      </Drawer>
      <ConfirmationDialog
        open={openLogoutModal}
        onClose={handleCloseLogoutModal}
        title="ログアウトしますか？"
        content="ログアウトしますか？"
        cancelText="キャンセル"
        confirmText="ログアウト"
        onCancel={handleCloseLogoutModal}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default Sidebar;
