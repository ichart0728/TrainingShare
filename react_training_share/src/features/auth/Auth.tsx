import React from "react";
import Modal from "react-modal";

import SignInModal from "../components/modal/SignInModal";
import SignUpModal from "../components/modal/SignUpModal";
import ForgotPasswordModal from "../components/modal/ForgotPasswordModal";
import ForgotPasswordConfirmationModal from "../components/modal/ForgotPasswordConfirmationModal";

const Auth: React.FC = () => {
  Modal.setAppElement("#root");
  return (
    <>
      <SignInModal />
      <SignUpModal />
      <ForgotPasswordModal />
      <ForgotPasswordConfirmationModal />
    </>
  );
};

export default Auth;
