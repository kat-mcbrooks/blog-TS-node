import mongoose, { Schema } from "mongoose";
import IUser from "../interfaces/user";

const UserSchema: Schema = new Schema({
  uid: { type: String, unique: true },
  name: { type: String },
});

export default mongoose.model<IUser>("User", UserSchema); //iUser is the document type that we created in interfaces. the user model needs a document type.
