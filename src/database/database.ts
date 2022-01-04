import mongoose from "mongoose";
import { DB_NAME, DB_CONNECTION } from "../config";

const options: mongoose.ConnectOptions = {
  dbName: DB_NAME as string,
};

(async () => {
  try {
    await mongoose.connect(DB_CONNECTION as string, options);
    console.log("Connected...");
  } catch (error) {
    console.log(error);
  }
})();
