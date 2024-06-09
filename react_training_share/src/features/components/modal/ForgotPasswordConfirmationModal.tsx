import React from "react";
import { AppDispatch } from "../../../app/store";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Modal.module.css";
import Modal from "react-modal";
import { Button } from "@material-ui/core";
import {
  selectOpenForgotPasswordConfirmation,
  resetOpenForgotPasswordConfirmation,
  setOpenSignIn,
} from "../../auth/authSlice";

const ForgotPasswordConfirmationModal: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const openForgotPasswordConfirmation = useSelector(
    selectOpenForgotPasswordConfirmation
  );

  const handleBackToLogin = async () => {
    await dispatch(resetOpenForgotPasswordConfirmation());
    await dispatch(setOpenSignIn());
  };

  return (
    <Modal
      isOpen={openForgotPasswordConfirmation}
      onRequestClose={() => {}}
      shouldCloseOnOverlayClick={false}
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.authTitle}>メールをご確認ください</h2>
        <p>
          パスワード再設定メールをお送りしました。お送りしたメールの内容に沿ってパスワードを再設定してください。
        </p>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBackToLogin}
          fullWidth
          style={{ marginTop: "20px" }}
        >
          ログイン画面に戻る
        </Button>
      </div>
    </Modal>
  );
};

export default ForgotPasswordConfirmationModal;
