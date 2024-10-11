import React from "react";
import { useLocation } from "react-router-dom";
import TokenVerifier from "./TokenVerifier";

const TokenVerifierWrapper = () => {
  const location = useLocation();
  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";

  return !isAuthRoute && <TokenVerifier />;
};

export default TokenVerifierWrapper;
