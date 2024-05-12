import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import StyledBadge from "../home/StyledBadge";
import {
  selectMyProfile,
  setOpenSignIn,
  resetOpenProfile,
  logout,
} from "../auth/authSlice";
import { resetOpenNewPost } from "../post/postSlice";
import {
  Avatar,
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
import HomeIcon from "@material-ui/icons/Home";
import CalendarToday from "@material-ui/icons/CalendarToday";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import FitnessCenter from "@material-ui/icons/FitnessCenter";
import styles from "./Sidebar.module.css";
import { useNavigate } from "react-router-dom";
import { setUserProfileId } from "../profile/profileSlice";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

const Sidebar = () => {
  const dispatch: AppDispatch = useDispatch();
  const myprofile = useSelector(selectMyProfile);
  const navigate = useNavigate();
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

  const sidebarContent = (
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
  );

  if (isMobile) {
    return (
      <>
        <BottomNavigation className={styles.bottomNavigation}>
          <BottomNavigationAction
            label="Home"
            icon={<HomeIcon />}
            onClick={handleHomeClick}
          />
          <BottomNavigationAction
            label="Workout"
            icon={<FitnessCenter />}
            onClick={handleWorkoutClick}
          />
          <BottomNavigationAction
            label="Calendar"
            icon={<CalendarToday />}
            onClick={handleCalendarClick}
          />
          <BottomNavigationAction
            label="Profile"
            icon={
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
            }
            onClick={handleMyProfileClick}
          />
          <BottomNavigationAction
            label="Logout"
            icon={<ExitToAppIcon />}
            onClick={handleLogoutClick}
          />
        </BottomNavigation>
        <Dialog
          open={openLogoutModal}
          onClose={handleCloseLogoutModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"ログアウトしますか？"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              ログアウトしますか？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseLogoutModal} color="primary">
              キャンセル
            </Button>
            <Button onClick={handleConfirmLogout} color="primary" autoFocus>
              ログアウト
            </Button>
          </DialogActions>
        </Dialog>
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
      <Dialog
        open={openLogoutModal}
        onClose={handleCloseLogoutModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"ログアウトしますか？"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ログアウトしますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutModal} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleConfirmLogout} color="primary" autoFocus>
            ログアウト
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;
