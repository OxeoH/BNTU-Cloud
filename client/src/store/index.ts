import { Middleware, configureStore } from "@reduxjs/toolkit";
import filterReducer from "./slices/filterSlice";
import userReducer from "./slices/userSlice";
import fileReducer from "./slices/fileSlice";

const bigIntMiddleware: Middleware = (store) => (next) => (action) => {
  const serializedAction = JSON.stringify(action, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  );

  const nextAction = JSON.parse(serializedAction);

  return next(nextAction);
};

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(bigIntMiddleware),
  reducer: {
    filter: filterReducer,
    user: userReducer,
    file: fileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
