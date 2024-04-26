import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, MAIN_ROUTE } from "../../routes/utils/consts";
import { verifyAuth } from "../../api/User";
import { setUser } from "../../store/slices/userSlice";

export const AuthWrap = ({ children }: { children: any }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = async () => {
      if (localStorage.getItem("token")) {
        const user = await verifyAuth();
        if (user) {
          dispatch(setUser(user));
        }
      }
    };
    checkToken();
  }, []);

  return <>{children}</>;
};
