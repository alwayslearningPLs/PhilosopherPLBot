import { Schema, model } from "mongoose";

const linkSchema = model<Link>(
  "Link",
  new Schema({
    title: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      required: true,
      default: "link",
    },
    language: {
      type: String,
      required: true,
      unique: true,
    },
    link: {
      type: String,
      required: true,
      unique: true,
    },
    tags: {
      type: [String],
      required: false,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  })
);

interface Link {
  title: string;
  language: string;
  link: string;
  tipo: string;
  tags: Array<string>;
  createdAt: Date;
}

export default linkSchema;
