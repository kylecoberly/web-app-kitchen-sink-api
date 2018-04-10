const assert = require("assert");
const {decode} = require("../../services/waks");

describe("WAKS", () => {
    it("decodes a WAKS-markup file", () => {
        const encodedString = `
// Ignore this
/* waks:start=This is a Heading=start
Annotation
waks:example */
const a = 'a';
/* waks:end */
// Ignore this too
        `;
        assert.deepEqual(decode(encodedString), [{
            heading: "This is a Heading",
            annotation: "Annotation\n",
            example: "const a = 'a';\n"
        }]);
    });
    it("decodes a WAKS-markup file with multiple annotations", () => {
        const encodedString = `
// Ignore this
/* waks:start=This is a Heading=start
Annotation1
waks:example */
const a = 'a';
/* waks:end */
// Ignore this too
/* waks:start=This is a Heading=start
Annotation2
waks:example */
const b = 'b';
/* waks:end */
// Ignore this as well
        `;
        assert.deepEqual(decode(encodedString), [{
            heading: "This is a Heading",
            annotation: "Annotation1\n",
            example: "const a = 'a';\n"
        },{
            heading: "This is a Heading",
            annotation: "Annotation2\n",
            example: "const b = 'b';\n"
        }]);
    });
});
