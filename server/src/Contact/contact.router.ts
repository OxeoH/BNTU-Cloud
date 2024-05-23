import { Request, Response, Router } from "express";
import contactController from "./contact.controller";

const contactRouter = Router();

contactRouter.post("/", async (req: Request, res: Response) => {
  await contactController.addContact(req, res);
});

contactRouter.delete("/", async (req: Request, res: Response) => {
  await contactController.removeContact(req, res);
});

contactRouter.get("/all", async (req: Request, res: Response) => {
  await contactController.getAllContacts(req, res);
});
export default contactRouter;
