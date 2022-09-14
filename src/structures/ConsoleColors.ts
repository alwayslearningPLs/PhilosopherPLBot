import { yellow, red, green, magenta, white, blue } from "chalk";

export default class Logger {
  date: string | number | Date;

  constructor() {
    const d = new Date();
    this.date = `${d.getDate()}/${
      d.getMonth() + 1
    }/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  }

  public success(...args: any[]) {
    console.log(
      white(`[${this.date}]`) + green(" (SUCCESS)") + magenta(` | ${args}`)
    );
  }

  public warn(...args: any[]) {
    console.log(
      white(`[${this.date}]`) + yellow(" (WARN)") + magenta(` | ${args}`)
    );
  }

  public error(...args: any[]) {
    console.log(
      white(`[${this.date}]`) + red(" (ERROR)") + magenta(` | ${args}`)
    );
  }

  public info(...args: any[]) {
    console.log(
      white(`[${this.date}]`) + blue(" (INFO)") + magenta(` | ${args}`)
    );
  }
}
