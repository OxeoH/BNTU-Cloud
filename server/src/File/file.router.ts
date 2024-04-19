import { Request, Response, Router } from "express";
import { check, checkSchema, validationResult } from "express-validator";
import fileController from "./file.controller";

const fileRouter = Router();

fileRouter.post("", async (req: Request, res: Response) => {
  await fileController.createNewDir(req, res);
});
fileRouter.get("", async (req: Request, res: Response) => {
  await fileController.fetchFiles(req, res);
});

export default fileRouter;
