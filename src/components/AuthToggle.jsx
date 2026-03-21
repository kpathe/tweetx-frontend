import React from "react";
import { useSelector } from "react-redux";
import { MainLayout } from "./index";
import { Home, Landing } from "../pages/index";

function AuthToggle() {
  const authStatus = useSelector((state) => state.auth.status);

  if (authStatus) {
    // Logged in: Show the Feed inside the Sidebar layout
    return (
      <MainLayout>
        <Home />
      </MainLayout>
    );
  }

  // Not logged in: Show the clean Landing page
  return <Landing />;
}

export default AuthToggle;
