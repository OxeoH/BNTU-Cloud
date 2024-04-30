import { Request, Response, Router } from "express";
import { check, checkSchema, validationResult } from "express-validator";
import fileController from "./file.controller";

const fileRouter = Router();

fileRouter.post("/create", async (req: Request, res: Response) => {
  await fileController.createNewDir(req, res);
});
fileRouter.get("", async (req: Request, res: Response) => {
  await fileController.fetchFiles(req, res);
});
fileRouter.post("/upload", async (req: Request, res: Response) => {
  await fileController.uploadFile(req, res);
});

export default fileRouter;
