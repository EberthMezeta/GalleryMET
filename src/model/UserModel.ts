import Mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  _id?: string;
  username: string;
  password: string;
  name?: string;
}

const UserSchema = new Mongoose.Schema(
  {
    id: { type: Object },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
  },
  { versionKey: false }
);

UserSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) {
    const document = this;

    bcrypt.hash(document.password, 10, (err, hash) => {
      if (err) return next(err);
      document.password = hash;
      next();
    });
  } else {
    next();
  }
});

UserSchema.methods.usernameExists = async (username): Promise<boolean> => {
  let result = await Mongoose.model("User").find({ username: username });
  return result.length > 0;
};

UserSchema.methods.isCorrectPassword = async (
  password,
  hash
): Promise<boolean> => {
  console.log(password, hash);
  const same = await bcrypt.compare(password, hash);
  return same;
};

export default Mongoose.model("User", UserSchema);
