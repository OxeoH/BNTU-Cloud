import dotenv from "dotenv";
dotenv.config();

import express from "express";

import cors from "cors";
import AppDataSource from "./data-source";
import userRouter from "./src/User/user.router";

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/user", userRouter);

const port = process.env.PORT || 5000;

const startTodoServer = async () => {
  try {
    await AppDataSource.initialize();
    app.listen(port, () => console.log("SERVER START ON PORT: ", port));
  } catch (e) {
    console.log(e);
  }
};

startTodoServer();
