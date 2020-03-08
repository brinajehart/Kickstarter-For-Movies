const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(cors());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "angular")));

app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "angular", "index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log("App is listening on port " + port);

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});