import { useEffect } from "react";

import { useLogout } from "../../../services/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

export const EasLogoutPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { logout } = useLogout();
  // useEffect(() => {
  console.log("logging out 1");
  (async () => {
    await logout();
  })();

  console.log("logging out");

  navigate("/", {
    replace: true,
  });
  // }, [params]);

  return <div></div>;
};
