const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises
const path = require("path");

const logEvents = async (message) => {
    const dateTime = `${format(new Date(), "yyyy/MM/dd HH:mm:ss")}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}`;
    console.log(logItem);

    try {
        if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
            await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
        }
        await fsPromises.appendFile(path.join(__dirname, "..", "logs", "eventLogs.txt"), logItem);
    } catch (error) {
        console.log(error);
    }
}

// Middleware function to log request information
const logger = (req, res, next) => {
    const logMessage = `${req.method} ${req.headers.origin} ${req.url} Query: ${JSON.stringify(req.query)} Body: ${JSON.stringify(req.body)}\n`;
    logEvents(logMessage, "reqLog.txt");
    console.log(logMessage);
    next();
};


module.exports = { logEvents, logger };