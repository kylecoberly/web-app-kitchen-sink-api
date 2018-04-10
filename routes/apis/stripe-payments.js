/* waks:start
This is an example annotation
waks:example */
const express = require("express");
const router = express.Router();

router.post("/", (request, response) => {
    const stripe = require("stripe")(process.env.STRIPE_KEY);

    stripe.charges.create({
        amount: request.body.charge,
        currency: "usd",
        description: request.body.description,
        source: request.body.stripeToken,
    }, (error, charge) => {
        error
            ? response.status(400).send(error.message)
            : response.json({data: charge});
    });
});
/* waks:end */

module.exports = router;
