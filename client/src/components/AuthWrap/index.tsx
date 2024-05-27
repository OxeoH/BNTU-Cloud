import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllUsers, verifyAuth } from "../../api/User";
import { setShares, setUser, setUsers } from "../../store/slices/userSlice";
import { setCurrentDir, setRootDir } from "../../store/slices/fileSlice";
import { useAppSelector } from "../../shared/hooks";
import { getUserContacts } from "../../api/Contact";
import { Contact } from "../../api/Contact/types";
import { getUserShares, getUsersShared } from "../../api/Share";
import {
  setFileFilter,
  updateUserOptions,
} from "../../store/slices/filterSlice";

export const AuthWrap = ({ children }: { children: any }) => {
  const dispatch = useDispatch();
  const currentDir = useAppSelector((state) => state.file.currentDir);
  const fileFilter = useAppSelector((state) => state.filter.fileFilter);
  const userFilter = useAppSelector((state) => state.filter.userFilter);

  useEffect(() => {
    const checkToken = async () => {
      if (localStorage.getItem("token")) {
        const user = await verifyAuth();
        const allUsers = await getAllUsers();
        const contacts = await getUserContacts();
        const userShares = await getUserShares();
        console.log("userShares: ", userShares);

        if (user) {
          if (allUsers) {
            dispatch(setUsers(allUsers));
            dispatch(updateUserOptions(allUsers));
          }
          if (userShares) dispatch(setShares(userShares));
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
