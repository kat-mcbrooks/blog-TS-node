import { Document } from "mongoose";
// everything else like created_at, updated_at is provided within the Document extension
export default interface IUser extends Document {
  uid: string;
  name: string;
}
