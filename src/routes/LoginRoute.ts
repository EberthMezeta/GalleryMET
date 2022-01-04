import express, { NextFunction, Request, Response } from "express";
import { middlewareHome } from "../middleware/AuthMiddleware";

import User, { IUser } from "../model/UserModel";

const router = express.Router();

router.get("/login", middlewareHome, (req: Request, res: Response) => {
  res.render("login/index");
});
router.get("/signup", middlewareHome, (req: Request, res: Response) => {
  res.render("login/signup");
});

router.post(
  "/auth",
  middlewareHome,
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password }: IUser = req.body;

    if (!username || !password) {
      console.log("falta un campo");
      res.redirect("/login");
      return;
    }

    try {
      const user = new User();
      const userExists = await user.usernameExists(username);

      if (!userExists) {
        res.redirect("/login");
        return;
      }

      const userFound = await User.findOne({ username: username });
      const passCorrect = await user.isCorrectPassword(
        password,
        userFound.password
      );

      if (!passCorrect) {
        res.redirect("/login");
        return;
      }
      console.log(userFound);
      req.session.user = userFound;
      res.redirect("/home");
    } catch (error) {
      console.log(error);
      res.redirect("/login");
    }
  }
);

router.post(
  "/register",
  middlewareHome,
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, name }: IUser = req.body;

    if (!username || !password || !name) {
      console.log("falta un campo");
      res.redirect("/signup");
    }

    const userObject = { username, password, name };
    const user = new User(userObject);
    try {
      const exists = await user.usernameExists(username);

      if (exists) {
        res.redirect("/signup");
      }

      await user.save();
      res.redirect("/login");
    } catch (error) {
      console.log(error);
      res.redirect("/login");
    }
  }
);

export default router;
