const express = require("express");
const router = express.Router();

const {decode} = require("../services/waks");
const {getAllExamples} = require("../services/github");

router.get("/:id", (request, response) => {
    getAllExamples(request.params.id)
        .then(decode)
        .then(annotatedExamples => {
            response.json({
                data: {
                    label: request.params.id,
                    annotatedExamples
                }
            });
        }).catch(error => {
            throw new Error(error);
        });
});

module.exports = router;
