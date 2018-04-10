/* waks:start=Payment Processing Server=start
This is an example route in Express for handling a Stripe payment. The request is `POST`ed to `/apis/stripe-payment`, and then processed.
waks:example */
const express = require("express");
const router = express.Router();

// Include the Stripe server library, and authenticate in your secret key.
const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/", (request, response) => {
    // Build the options
    const options = {
        // If you're not hard-coding this on the server, make sure you validate
        // it so that it's the correct amount for what they're buying
        amount: +request.body.amount,
        currency: "usd",
        description: request.body.description,
        source: request.body.token,
    };
    // Create a charge with them
    stripe.charges.create(options, (error, charge) => {
        error
            // If there was an error processing it, send back an error
            ? response.status(400).json({error: error.message})
            // Otherwise, send back details about the payment
            : response.json({data: charge});
    });
});
/* waks:end */

module.exports = router;
