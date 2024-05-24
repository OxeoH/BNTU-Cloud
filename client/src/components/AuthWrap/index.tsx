import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, MAIN_ROUTE } from "../../routes/utils/consts";
import { verifyAuth } from "../../api/User";
import { setUser } from "../../store/slices/userSlice";
import { setCurrentDir, setRootDir } from "../../store/slices/fileSlice";
import { useAppSelector } from "../../shared/hooks";
import { getUserContacts } from "../../api/Contact";
import { Contact } from "../../api/Contact/types";

export const AuthWrap = ({ children }: { children: any }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentDir = useAppSelector((state) => state.file.currentDir);

  useEffect(() => {
    const checkToken = async () => {
      if (localStorage.getItem("token")) {
        const user = await verifyAuth();
        const contacts = await getUserContacts();

        if (user) {
          user.contacts = contacts ?? ([] as Contact[]);
          dispatch(setUser(user));
          dispatch(setCurrentDir(currentDir ?? user.files[0]));
          dispatch(setRootDir(user.files[0]));
        }
      }
    };
    checkToken();
  }, []);

  return <>{children}</>;
};
