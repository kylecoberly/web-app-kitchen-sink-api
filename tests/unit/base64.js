const assert = require("assert");
const {decode} = require("../../services/base64");

describe("Base64", () => {
    it("decodes a base64String", () => {
        assert.equal(decode("dGVzdA=="), "test");
    });
});
