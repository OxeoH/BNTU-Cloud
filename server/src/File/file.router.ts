import { Request, Response, Router } from "express";
import { check, checkSchema, validationResult } from "express-validator";

const fileRouter = Router();

fileRouter.post(
  "/",
  //   checkSchema({
  //     email: { isEmail: true },
  //     password: { isLength: { options: { min: 8 } } },
  //     login: { isLength: { options: { min: 4 } } },
  //     name: { notEmpty: true },
  //     surname: { notEmpty: true },
  //     patronymic: { notEmpty: true },
  //     role: { notEmpty: true },
  //   }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Incorrect request", errors });
    }
    //await userController.registerUser(req, res);
  }
);

fileRouter.post(
  "/",
  //   checkSchema({
  //     pasword: { isLength: { options: { min: 8 } } },
  //     login: { isLength: { options: { min: 4 } } },
  //   }),
  async (req: Request, res: Response) => {
    //await userController.authUser(req, res);
  }
);

export default fileRouter;
