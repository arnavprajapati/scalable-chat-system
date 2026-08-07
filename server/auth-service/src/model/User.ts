import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  username?: string;
  usernameLower?: string;
  avatar?: { url: string; public_id: string };
}

const schema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
    },
    usernameLower: {
      type: String,
    },
    avatar: {
      url: { type: String },
      public_id: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

schema.index({ usernameLower: 1 }, { unique: true, sparse: true });

export const User = mongoose.model<IUser>("User", schema);
