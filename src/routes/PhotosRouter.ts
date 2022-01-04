import express, { NextFunction, Request, Response } from "express";
import Album, { IAlbum } from "../model/AlbumModel";
import Photo, {
  IPhoto,
  IPhotoFavRequest,
  IPhotoRequest,
} from "../model/PhotoModel";

import { middleware } from "../middleware/AuthMiddleware";

const router = express.Router();

router.post(
  "/add-to-album",
  middleware,
  async (req: Request, res: Response) => {
    const { ids, albumid }: IPhotoRequest = req.body;

    const idPhotos = ids.split(",");
    const promises = [];

    for (let index = 0; index < idPhotos.length; index++) {
      promises.push(
        Photo.findByIdAndUpdate(idPhotos[index].trim(), {
          $push: { albums: albumid.trim() as any },
        })
      );
    }
    await Promise.all(promises);
    res.redirect("/home");
  }
);

router.post(
  "/add-favorite",
  middleware,
  async (req: Request, res: Response) => {
    const { photoid, origin }: IPhotoFavRequest = req.body;

    try {
      await Photo.findByIdAndUpdate(photoid.trim(), {
        $set: { favorite: true as any },
      });
      res.redirect(origin.trim());
    } catch (error) {
      console.log(error);
    }
  }
);

router.post(
  "/remove-favorite",
  middleware,
  async (req: Request, res: Response) => {
    const { photoid, origin }: IPhotoFavRequest = req.body;
    try {
      await Photo.findByIdAndUpdate(photoid.trim(), {
        $set: { favorite: false as any },
      });
      res.redirect(origin.trim());
    } catch (error) {
      console.log(error);
    }
  }
);

router.get(
  "/view/:photoid",
  middleware,
  async (req: Request, res: Response) => {
    const id = req.params.photoid as string;
    const origin = req.query.origin as string;
    try {
      const photo = await Photo.findById(id);

      res.render("layout/preview", {
        user: req.session.user,
        photo,
        origin,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

export default router;
