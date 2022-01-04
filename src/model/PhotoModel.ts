import Mongoose from "mongoose";

export interface IPhotoRequest {
  ids: string;
  albumid : string;
}


export interface IPhotoFavRequest {
  photoid: string;
  origin : string;
}



export interface IPhoto {
  _id?: string;
  filename: string;
  userid: string;
  size: number;
  mimeType:string;
  createdAt?: Date;
  favorite: boolean;
  albums: string [];
}

const PhotoSchema = new Mongoose.Schema(
  {
    id: { type: Object },
    filename: { type: String, required: true },
    userid: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    favorite: { type: Boolean, required: true, default: false },
    albums: { type: Array, required: true, default: [] },
  },
  { versionKey: false }
);

export default Mongoose.model("Photo", PhotoSchema);
