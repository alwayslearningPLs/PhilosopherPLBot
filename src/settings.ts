import { Settings } from "./types/ConfigurationType";

export const Token: string =
  "MTAxNjQwMDEwOTIwODA5NjgzOQ.G5Gf_l.zFaPxCWmiceVzx1BFAwe6vlUdAEc0VNjIeEhTg";
export const configuration: Settings = {
  serverID: "1014025040448192533",
  testing: true || false,
  mongoData: {
    uri: "mongodb://mongo:REjWTDlaNqx0GiLfBTmw@containers-us-west-41.railway.app:5610",
  },
  devs: [
    "992146567555448934" /** ex&#2993 */,
    "647535708172582927" /** MrNobody#1742 */,
    "490381703987200019" /** Nekes#1632 */,
  ],
};

export const categorys = ["Utils"];

export enum Colors {
  Error = "#eb4034",
  Success = "#6ad966",
  Warn = "#e69627",
  Default = "#7289da",
  Invisible = "#2c2f33",
}
