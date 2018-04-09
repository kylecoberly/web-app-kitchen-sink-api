require("dotenv").load();
const express = require("express");
const app = express();

app.use(require("cors")());
app.use(require("body-parser").json());

["stripe-payments"].forEach(example => {
    app.use(`/examples/${example}`, require(`./routes/${example}`));
});

/* Error handling */
app.use((request, response, next) => {
    response.status(404).json({error: "Not found"});
});

app.use((error, request, response, next) => {
    response.status(500).json({error: error.message});
});

module.exports = app;
