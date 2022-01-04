import express, { NextFunction, Request, Response } from "express";
import { middleware } from "../middleware/AuthMiddleware";
import Album, { IAlbum } from "../model/AlbumModel";
import Photo from "../model/PhotoModel";

const router = express.Router();

router.get("/albums",middleware, async (req: Request, res: Response) => {
  try {
    const albums = await Album.find({ userid: req.session.user._id });
    res.render("albums/index", { userid: req.session.user, albums });
  } catch (error) {
    console.log(error);
  }
});

router.get("/albums/:id",middleware, async (req: Request, res: Response) => {
  const albumid = req.params.id;
  
  try {
    let photos = await Photo.find({ albums: albumid });

    let album = await Album.findById(albumid);
    const albums = await Album.find({ userid: req.session.user._id! });

    console.log("Obejti algym:",album);
    console.log("resyktado:",album.userid !== req.session.user._id && album.isPrivate);

    if (album.userid !== req.session.user._id && album.isPrivate) {
      res.render("error/privacy", {});
      return;
    }
   

    res.render("albums/view", {
      user: req.session.user,
      photos,
      album,
      albums,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/create-album",middleware, async (req: Request, res: Response) => {
  const { name, isPrivate }: { name: string; isPrivate: string } = req.body;

  const albumObject: IAlbum = {
    name: name,
    userid: req.session.user._id,
    isPrivate: isPrivate === "on",
    createdAt: new Date(),
  };

  try {
    const album = await new Album(albumObject);
    album.save();
    res.redirect("/albums");
  } catch (error) {
    console.log(error);
  }
});

export default router;
