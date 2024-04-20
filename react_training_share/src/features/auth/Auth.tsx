import React from "react";
import Modal from "react-modal";

import SignInModal from "../components/SignInModal";
import SignUpModal from "../components/SignUpModal";

const Auth: React.FC = () => {
  Modal.setAppElement("#root");
  return (
    <>
      <SignInModal />
      <SignUpModal />
    </>
  );
};

export default Auth;
