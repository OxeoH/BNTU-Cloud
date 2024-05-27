import { Request, Response, Router } from "express";
import userController from "./share.controller";
import shareController from "./share.controller";

const shareRouter = Router();

shareRouter.post("/add", async (req: Request, res: Response) => {
  await shareController.createShare(req, res);
});

shareRouter.post("/remove", async (req: Request, res: Response) => {
  await shareController.removeShare(req, res);
});

shareRouter.post("/remove/strange", async (req: Request, res: Response) => {
  await shareController.removeStrangeShare(req, res);
});

shareRouter.get("/shared", async (req: Request, res: Response) => {
  await shareController.fetchShared(req, res);
});

shareRouter.get("/all", async (req: Request, res: Response) => {
  await shareController.getAllUserShares(req, res);
});
export default shareRouter;
