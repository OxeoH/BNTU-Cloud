import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllUsers, verifyAuth } from "../../api/User";
import { setShares, setUser, setUsers } from "../../store/slices/userSlice";
import { setCurrentDir, setRootDir } from "../../store/slices/fileSlice";
import { useAppSelector } from "../../shared/hooks";
import { getUserContacts } from "../../api/Contact";
import { Contact } from "../../api/Contact/types";
import { getUserShares } from "../../api/Share";
import { updateUserOptions } from "../../store/slices/filterSlice";

export const AuthWrap = ({ children }: { children: any }) => {
  const dispatch = useDispatch();
  const currentDir = useAppSelector((state) => state.file.currentDir);

  useEffect(() => {
    const checkToken = async () => {
      if (localStorage.getItem("token")) {
        const user = await verifyAuth();
        const allUsers = await getAllUsers();
        const contacts = await getUserContacts();
        const userShares = await getUserShares();

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
