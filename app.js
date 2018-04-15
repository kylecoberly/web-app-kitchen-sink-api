require("dotenv").load();

const express = require("express");
const app = express();

app.use(require("cors")());
app.use(require("body-parser").json());

[
    "stripe-payments",
    "s3-uploads",
].forEach(example => {
    app.use(`/apis/${example}`, require(`./routes/apis/${example}`));
});

app.use("/examples", require("./routes/examples"));

/* Error handling */
app.use((request, response, next) => {
    response.status(404).json({error: "Not found"});
});

app.use((error, request, response, next) => {
    console.error("Server Error:", error.stack);
    response.status(500).json({error: error.message});
});

module.exports = app;
