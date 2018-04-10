const assert = require("assert");
const github = require("../../services/github");

describe("Github Service", () => {
    it("Retrieves a file", done => {
        github.getFile("kylecoberly", "web-app-kitchen-sink-api", "tests/test-content").then(contents => {
            assert.equal(contents, "This is testable content\n");
            done();
        }).catch(done);
    });
    it("Recovers from Not Found errors", done => {
        github.getFile("kylecoberly", "web-app-kitchen-sink-api", "tests/doesnt-exist").then(contents => {
            assert.equal(contents, "");
            done();
        }).catch(done);
    });
    it("Retrieves backend examples", done => {
        github.getBackendExamples("test-markup").then(contents => {
            assert.equal(contents, `\/\/ Ignore this
\/* waks:start
a
b
waks:example *\/
d
e
\/* waks:end *\/
\/\/ Ignore this too
\/* waks:start
f
g
waks:example *\/
h
i
\/* waks:end *\/
\/\/ Ignore this as well
`
            );
            done();
        }).catch(done);
    });
    it("Retrieves frontend examples", done => {
        github.getFrontendExamples("test-markup").then(contents => {
            assert.equal(contents, `\/\/ Ignore this
\/* waks:start
a
b
waks:example *\/
d
e
\/* waks:end *\/
\/\/ Ignore this too
\/* waks:start
f
g
waks:example *\/
h
i
\/* waks:end *\/
\/\/ Ignore this as well
`
            );
            done();
        }).catch(done);
    });
    it("Retrieves all examples", done => {
        github.getAllExamples("test-markup").then(contents => {
            assert.equal(contents, `\/\/ Ignore this
\/* waks:start
a
b
waks:example *\/
d
e
\/* waks:end *\/
\/\/ Ignore this too
\/* waks:start
f
g
waks:example *\/
h
i
\/* waks:end *\/
\/\/ Ignore this as well
\/\/ Ignore this
\/* waks:start
a
b
waks:example *\/
d
e
\/* waks:end *\/
\/\/ Ignore this too
\/* waks:start
f
g
waks:example *\/
h
i
\/* waks:end *\/
\/\/ Ignore this as well
`
            );
            done();
        }).catch(done);
    });
});
