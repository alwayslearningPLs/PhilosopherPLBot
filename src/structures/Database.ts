import { connect } from "mongoose";

export default class Database {
  uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }

  public async init() {
    await connect(this.uri);
  }
}
