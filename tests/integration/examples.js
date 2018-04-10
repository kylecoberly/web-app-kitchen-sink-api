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
                        annotation: "a\nb\n",
                        example: "d\ne\n"
                    },{
                        annotation: "f\ng\n",
                        example: "h\ni\n"
                    },{
                        annotation: "a\nb\n",
                        example: "d\ne\n"
                    },{
                        annotation: "f\ng\n",
                        example: "h\ni\n"
                    }]
                });
                done();
            }).catch(done);
    });
});
