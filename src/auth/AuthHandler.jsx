import React, { useEffect } from "react";

import { useSelector } from "react-redux";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { CheckingAuth } from "./components/CheckingAuth";

export const AuthHandler = () => {
  const { status } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (status === "authenticated") {
      navigate("/app", { replace: true });
      // if (userRole === "admin") {
      //   navigate("/admin", { replace: true });
      // } else {
      //   navigate("/app", { replace: true });
      // }
    } else if (
      status === "not-authenticated" &&
      location.pathname !== "/" &&
      !location.pathname.startsWith("/auth")
    ) {
      navigate("/auth", { replace: true });
    }
  }, [navigate, status]);

  if (status === "checking") {
    return <CheckingAuth />;
  }

  return <Outlet />;
};
