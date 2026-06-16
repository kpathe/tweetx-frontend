import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Spinner } from "./index";

function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (authentication && authStatus !== authentication) {
      navigate("/login");
    } else if (!authentication && authStatus !== authentication) {
      navigate("/");
    }

  }, [authStatus, navigate, authentication]);

  if (authStatus !== authentication) {
    return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950">
      <Spinner size="lg" className="text-violet-600 dark:text-violet-400" />
    </div>
    );
  }

  return <>{children}</>;
}

export default Protected;
