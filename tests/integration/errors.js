const assert = require("assert");
const request = require("supertest");
const app = require("../../app");

describe("Errors", () => {
    it("throws 404s for unmatched paths", done => {
        request(app)
            .get("/asdf")
            .expect(404)
            .expect("Content-Type", /json/)
            .then(() => {
                done();
            }).catch(error => {
                done(error);
            });
    });
    it("throws 404s for unmatched methods", done => {
        request(app)
            .post("/")
            .expect(404)
            .expect("Content-Type", /json/)
            .then(() => {
                done();
            }).catch(error => {
                done(error);
            });
    });
});
