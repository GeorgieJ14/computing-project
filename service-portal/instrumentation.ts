export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {

    // await import('winston');
    // await import("next-logger/presets/next-only");
    const logger = await import('@/lib/logger');
    console.error = (msg, ...args) => logger.default.error(msg, ...args);
    console.warn = (msg, ...args) => logger.default.warn(msg, ...args);
    console.info = (msg, ...args) => logger.default.info(msg, ...args);
    console.log = (msg, ...args) => logger.default.http(msg, ...args);
    console.debug = (msg, ...args) => logger.default.debug(msg, ...args);
  }
}
