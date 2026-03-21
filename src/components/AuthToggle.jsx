import React from "react";
import { useSelector } from "react-redux";
import { MainLayout } from "./index";
import { Home, Landing } from "../pages/index";

function AuthToggle() {
  const authStatus = useSelector((state) => state.auth.status);

  if (authStatus) {
    return (
      <MainLayout>
        <Home />
      </MainLayout>
    );
  }
  return <Landing />;
}

export default AuthToggle;
