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
fileRouter.post("/avatar", async (req: Request, res: Response) => {
  await fileController.uploadAvatar(req, res);
});
fileRouter.delete("/avatar", async (req: Request, res: Response) => {
  await fileController.deleteAvatar(req, res);
});

fileRouter.get("/download", async (req: Request, res: Response) => {
  await fileController.downloadFile(req, res);
});

fileRouter.post("/delete", async (req: Request, res: Response) => {
  await fileController.deleteFile(req, res);
});

export default fileRouter;
