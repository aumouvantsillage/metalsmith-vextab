
var assert = require("assert");
var equal = require('assert-dir-equal');
var Metalsmith = require("metalsmith");
var vextab = require("..");

describe("metalsmith-vextab", function () {
    it("should convert VexTab source with default delimiter", function (done) {
        Metalsmith("test/fixtures/default")
            .use(vextab())
            .build(function (err, files) {
                if (err) return done(err);
                equal('test/fixtures/default/expected', 'test/fixtures/default/build');
                assert(files["index.html"].vextab);
                done();
            });
    });
    it("should convert VexTab source with custom delimiters", function (done) {
        Metalsmith("test/fixtures/custom")
            .use(vextab({
				startDelimiter: "{|",
				endDelimiter: "|}"
			}))
            .build(function (err, files) {
                if (err) return done(err);
                equal('test/fixtures/custom/expected', 'test/fixtures/custom/build');
                assert(files["index.html"].vextab);
                done();
            });
    });
    it("should convert HTML with no VexTab block", function (done) {
        Metalsmith("test/fixtures/plain")
            .use(vextab())
            .build(function (err, files) {
                if (err) return done(err);
                equal('test/fixtures/plain/expected', 'test/fixtures/plain/build');
                assert(!files["index.html"].vextab);
                done();
            });
    });
});
