import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import { middleware } from "../middleware/AuthMiddleware";
import Album from "../model/AlbumModel";
import Photo from "../model/PhotoModel";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".");
    const uniqueSuffix = Date.now + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "." + ext[ext.length - 1]);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.get("/home", middleware, async (req: Request, res: Response) => {
  try {
    const albums = await Album.find({ userid: req.session.user._id! });
    const photos = await Photo.find({ userid: req.session.user._id! });
    res.render("home/index", { user: req.session.user, photos, albums });
  } catch (error) {
    res.render("home/index", { user: req.session.user });
  }
});

router.post(
  "/upload",
  middleware,
  upload.single("photos"),
  (req: Request, res: Response) => {
    const file = req.file!;

    if (!file) {
      res.redirect("/home");
      return;
    }

    const photoObject = {
      filename: file.filename,
      userid: req.session.user._id!,
      size: file.size,
      mimeType: file.mimetype,
      createdAt: new Date(),
      favorite: false,
      albums: [],
    };

    const photo = new Photo(photoObject);
    photo.save();
    res.redirect("/home");
  }
);

export default router;
