import { Request, Response, Router } from "express";
import userController from "./user.controller";
import { check, checkSchema, validationResult } from "express-validator";

const userRouter = Router();

userRouter.post(
  "/registration",
  checkSchema({
    email: { isEmail: true },
    password: { isLength: { options: { min: 8 } } },
    login: { isLength: { options: { min: 4 } } },
    name: { notEmpty: true },
    surname: { notEmpty: true },
    patronymic: { notEmpty: true },
    role: { notEmpty: true },
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Incorrect request", errors });
    }
    await userController.registerUser(req, res);
  }
);

userRouter.post(
  "/login",
  checkSchema({
    pasword: { isLength: { options: { min: 8 } } },
    login: { isLength: { options: { min: 4 } } },
  }),
  async (req: Request, res: Response) => {
    await userController.authUser(req, res);
  }
);

userRouter.get("/verify-auth", async (req: Request, res: Response) => {
  await userController.checkIsAuth(req, res);
});

userRouter.get("/all", async (req: Request, res: Response) => {
  await userController.getAllUsers(req, res);
});
export default userRouter;
