const assert = require("assert");
const request = require("supertest");
const app = require("../../app");

describe("Examples", () => {
    it("Can retrieve and parse a GH file", done => {
        request(app)
            .get("/examples/test-markup")
            .then(response => {
                assert.deepEqual(response.body, {
                    data: [{
                        heading: "Heading",
                        annotation: "a\nb\n",
                        example: "d\ne\n"
                    },{
                        heading: "Heading",
                        annotation: "f\ng\n",
                        example: "h\ni\n"
                    },{
                        heading: "Heading",
                        annotation: "a\nb\n",
                        example: "d\ne\n"
                    },{
                        heading: "Heading",
                        annotation: "f\ng\n",
                        example: "h\ni\n"
                    }]
                });
                done();
            }).catch(done);
    });
});
