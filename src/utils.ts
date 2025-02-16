export function sleep(duration: number) {
  return new Promise((resolve, _) => setTimeout(resolve, duration));
}

export function deepEqual(x: any, y: any) {
  if (x === y) {
    return true;
  } else if (
    typeof x == "object" &&
    x != null &&
    typeof y == "object" &&
    y != null
  ) {
    if (Object.keys(x).length != Object.keys(y).length) return false;

    for (var prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!deepEqual(x[prop], y[prop])) return false;
      } else return false;
    }

    return true;
  } else return false;
}

export function green(str: string) {
  return `\x1b[32m${str}\x1b[0m`;
}

export function red(str: string) {
  return `\x1b[31m${str}\x1b[0m`;
}

export function yellow(str: string) {
  return `\x1b[33m${str}\x1b[0m`;
}

export function bold(str: string) {
  return `\x1b[1m${str}\x1b[0m`;
}

export function info(str: string) {
  return `${yellow("[info]")} ${str}`;
}

export function success(str: string) {
  return `${green("[success]")} ${str}`;
}

export function error(str: string) {
  return `${red("[error]")} ${str}`;
}

export function parseTerminalParams() {
  const args = process.argv.slice(2);
  const params = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith("--")) {
      const parts = arg.slice(2).split("=");
      const key = parts[0];
      let value: string | boolean;

      if (parts.length > 1) {
        value = parts[1];
      } else if (i + 1 < args.length && !args[i + 1].startsWith("-")) {
        value = args[i + 1];
        i++;
      } else {
        value = true;
      }
      params[key] = value;
    } else if (arg.startsWith("-")) {
      const key = arg.slice(1);
      let value: string | boolean;

      if (i + 1 < args.length && !args[i + 1].startsWith("-")) {
        value = args[i + 1];
        i++;
      } else {
        value = true;
      }
      params[key] = value;
    } else {
      params[i] = arg;
    }
  }

  return params;
}
