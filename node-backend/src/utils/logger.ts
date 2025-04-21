const info = (message: string, ...args: any[]): void => {
    console.log(`INFO: ${message}`, ...args);
}

const error = (message: string, ...args: any[]): void => {
    console.error(`ERROR: ${message}`, ...args);
}

const warn = (message: string, ...args: any[]): void => {
    console.warn(`WARN: ${message}`, ...args);
}

const debug = (message: string, ...args: any[]): void => {
    console.debug(`DEBUG: ${message}`, ...args);
}

export default {
    info,
    error,
    warn,
    debug   
};