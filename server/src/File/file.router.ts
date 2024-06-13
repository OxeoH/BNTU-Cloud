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

// fileRouter.get("/shared", async (req: Request, res: Response) => {
//   await fileController.fetchShared(req, res);
// });

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

fileRouter.get("/download/shared", async (req: Request, res: Response) => {
  await fileController.downloadSharedFile(req, res);
});

fileRouter.post("/delete", async (req: Request, res: Response) => {
  await fileController.deleteFile(req, res);
});

fileRouter.post("/admin/change/avatar", async (req: Request, res: Response) => {
  await fileController.uploadContactAvatar(req, res);
});

export default fileRouter;
