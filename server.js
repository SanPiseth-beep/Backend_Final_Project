require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3000;

connectDB();

app.use(logger);
app.use(cors(corsOptions));


app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", require("./routes/root"));
// API route
app.use("/states", require("./routes/api/states"));

// handle undefined routes
app.all("*", (req, res) => {
    res.status(404);
    if(req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
        res.json({error: "404 not found"})
    } else {
        res.type("txt").send("404 not found");
    }
});


app.use(errorHandler);

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});