// Import the logEvents function from the logEvents module
const { logEvents } = require('./logEvents');

// Define the error handler middleware
const errorHandler = (err, res) => {
    // Log the error name and message to a file named 'errorlog.txt'
    logEvents(`${err.name}: ${err.message}`, 'errorlog.txt');
    
    // Log the error stack trace to the console
    console.error(err.stack)
    
    // Send a 500 status code (Internal Server Error) and the error message to the client
    res.status(500).send(err.message);
}

// Export the error handler middleware
module.exports = errorHandler;