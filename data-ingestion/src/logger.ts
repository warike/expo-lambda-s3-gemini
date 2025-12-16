import pino from "pino";


export default pino({
    level: process.env.LOG_LEVEL || 'info',
    depthLimit: 10, // Increase serialization depth
    transport: {
        target: 'pino-pretty',
        options: {
            // General Options
            colorize: true, // Adds terminal color escape sequences
            colorizeObjects: true, // Adds color to the formatted object
            depth: 10, // Increase formatting depth
            translateTime: 'SYS:standard', // Translates timestamp to a human-readable format (e.g., yyyy-mm-dd HH:MM:ss.l o)
            ignore: 'pid,hostname', // Excludes specific keys from the log output (comma-separated string)
            levelFirst: true, // Displays the log level name before the date/time
            crlf: false, // Appends carriage return and line feed, instead of just a line feed

            // Message Formatting
            messageKey: 'msg', // Defines the key that contains the main log message
            messageFormat: '{lvl} {msg}', // Customizes the output format of the log line

            // Custom Colors (Optional)
            customColors: {
                info: 'green',
                warn: 'yellowBright',
                error: 'redBright',
                debug: 'blue',
                fatal: 'bgRed', // Use 'bg' prefix for background colors
            },

            // Error Handling
            errorLikeObjectKeys: ['err', 'error'], // Defines keys associated with error objects
            errorProps: '', // When formatting an error object, display this list of properties (comma-separated)
        },
    },
});