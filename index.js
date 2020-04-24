const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./server/auth.js");
const scriptRoutes = require("./server/scripts.js");
const commentRoutes = require('./server/comments.js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(cors());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "angular")));

app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "angular", "index.html"));
});


app.use("/api/auth", authRoutes);
app.use("/api/scripts", scriptRoutes);
app.use("/api/comments", commentRoutes);

const port = process.env.PORT || 4444;
app.listen(port);

console.log("App is listening on port " + port);

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});