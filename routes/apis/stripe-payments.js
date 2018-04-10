/* waks:start=Express Route=start
This is an example annotation
waks:example */
const express = require("express");
const router = express.Router();

const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/", (request, response) => {
    const options = {
        amount: +request.body.amount,
        currency: "usd",
        description: request.body.description,
        source: request.body.token,
    };
    stripe.charges.create(options, (error, charge) => {
        error
            ? response.status(400).json({error: error.message})
            : response.json({data: charge});
    });
});
/* waks:end */

module.exports = router;
