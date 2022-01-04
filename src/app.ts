import express, { Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import { join } from "path";
import { SESSION_SECRET } from "./config";
import  loginRouter  from "./routes/LoginRoute";
import homeRouter from "./routes/HomeRouter";
import albumsRouter from "./routes/AlbumsRouter";
import photosRouter from "./routes/PhotosRouter";

import { IUser } from "./model/UserModel";

declare module "express-session"{
  interface Session{
    user:IUser
  }
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(express.static(join(__dirname, "../public")));
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");  

app.use(
  session({
    secret: SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(loginRouter);
app.use(homeRouter);
app.use(albumsRouter);
app.use(photosRouter);

app.use(function (req,res,next) {
  res.render("error/404");
})

app.get("/", (req: Request, res: Response) => {
  res.redirect("login/index");
});

export default app;
