import { TEST } from './config';

const colours = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m',
  },
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m',
  },
};

/**
 * Retrieves the name of the function that called the function that threw the given error.
 *
 * @param {Error} error - The error that was thrown.
 * @return {string} The name of the calling function, or '--' if the stack trace is not available.
 */
export function getCallingFunction(error: Error) {
  try {
    const stack = error.stack;

    if (stack === undefined) return '--';

    const line = stack.split('\n')[2];
    const regex = /^.*at\s([a-zA-Z]+).*$/;
    const groups = line.match(regex);

    if (groups === null) return '--';

    if (groups.length < 2) return '--';

    return groups[1];
  } catch {
    return '--';
  }
}

/**
 * Logs a message to the console with optional parameters if TEST is false.
 *
 * @param {any} message - The message to log.
 * @param {...any} optionalParams - Optional parameters to log.
 */
export function log(message?: any, ...optionalParams: any[]) {
  if (!TEST)
    console.log(
      `[${new Date().toLocaleString()}]`,
      colours.fg.magenta,
      '[SERVER-LOG] ',
      colours.reset,
      message,
      ...optionalParams,
    );
}

/**
 * Logs an informational message to the console, along with optional parameters.
 *
 * @param {any} message - The message to log.
 * @param {...any} optionalParams - Optional parameters to log.
 */
export function info(message?: any, ...optionalParams: any[]) {
  if (!TEST)
    console.info(
      `[${new Date().toLocaleString()}]`,
      colours.fg.cyan,
      '[INFO]',
      colours.reset,
      colours.bg.green,
      `[${getCallingFunction(new Error())}]`,
      colours.reset,
      message,
      ...optionalParams,
    );
}

/**
 * Logs a warning message to the console with optional parameters if TEST is false.
 *
 * @param {any} message - The message to log.
 * @param {...any} optionalParams - Optional parameters to log.
 */
export function warn(message?: any, ...optionalParams: any[]) {
  if (!TEST)
    console.warn(
      `[${new Date().toLocaleString()}]`,
      colours.fg.yellow,
      '[WARN]',
      colours.reset,
      colours.bg.green,
      `[${getCallingFunction(new Error())}]`,
      colours.reset,
      message,
      ...optionalParams,
    );
}

/**
 * Logs an error message to the console with optional parameters if TEST is false.
 *
 * @param {any} message - The message to log.
 * @param {...any} optionalParams - Optional parameters to log.
 */
export function error(message?: any, ...optionalParams: any[]) {
  if (!TEST)
    console.error(
      `[${new Date().toLocaleString()}]`,
      colours.fg.red,
      '[ERROR]',
      colours.reset,
      colours.bg.green,
      `[${getCallingFunction(new Error())}]`,
      colours.reset,
      message,
      ...optionalParams,
    );
}

const logging = {
  log,
  info,
  warn,
  error,
  warning: warn,
  getCallingFunction,
};

/** Create the global definition */
declare global {
  var logging: {
    log: (message?: any, ...optionalParams: any[]) => void;
    info: (message?: any, ...optionalParams: any[]) => void;
    warn: (message?: any, ...optionalParams: any[]) => void;
    warning: (message?: any, ...optionalParams: any[]) => void;
    error: (message?: any, ...optionalParams: any[]) => void;
    getCallingFunction: (error: Error) => string;
  };
}

/** Link the local and global variable */
globalThis.logging = logging;

export default logging;
