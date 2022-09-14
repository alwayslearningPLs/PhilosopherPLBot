export interface Settings {
  serverID: string;
  testing: boolean;
  mongoData: { uri: string };
  devs: Array<string>;
}
