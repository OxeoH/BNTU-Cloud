import dotenv from "dotenv";
dotenv.config();

import express from "express";
import filrUpload from "express-fileupload";

import cors from "cors";
import AppDataSource from "./data-source";
import userRouter from "./src/User/user.router";
import fileRouter from "./src/File/file.router";
import contactRouter from "./src/Contact/contact.router";
import shareRouter from "./src/Share/share.router";

const app = express();
app.use(cors());
app.use(express.static("static"));
app.use(express.json());
app.use(
  filrUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/api/user", userRouter);
app.use("/api/files", fileRouter);
app.use("/api/contact", contactRouter);
app.use("/api/shares", shareRouter);

const port = process.env.PORT || 5000;

const startTodoServer = async () => {
  try {
    await AppDataSource.initialize();
    app.listen(port, () => console.log("SERVER WAS STARTED ON PORT: ", port));
  } catch (e) {
    console.log(e);
  }
};

startTodoServer();
