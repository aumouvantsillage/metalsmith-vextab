var path = require("path");
var debug = require("debug")("metalsmith-vextab");
var childProcess = require('child_process');
var phantomPath = require('phantomjs').path;
var execSync = require("execSync");

module.exports = plugin;

function plugin(options) {
    options = options || {};
    options.startDelimiter = options.startDelimiter || "<vextab>";
    options.endDelimiter = options.endDelimiter || "</vextab>";
    options.width = options.width || 600;
    options.logo = !!options.logo;
	
    return function (files, metalsmith, done) {
        Object.keys(files).forEach(function (file) {
            debug("Converting file: %s", file);
            convert(files[file], options);
        });
        done();
    };
}

var renderJsPath = path.join(__dirname, "render.js");
var renderHtmlPath = path.join(__dirname, "render.html");

function convert(data, options) {
    // Split the string at the start delimiters
    var substrings = data.contents.toString().split(options.startDelimiter);
    if (substrings.length < 2) {
        return;
    }

    for (var i = 1; i < substrings.length; i += 2) {
        // If the start and end delimiters are different,
        // split each substring at the end delimiter.
        if (options.startDelimiter !== options.endDelimiter) {
            var splitEnd = substrings[i].split(options.endDelimiter);
            if (splitEnd.length === 2) {
                substrings[i] = splitEnd[0];
                substrings.splice(i + 1, 0, splitEnd[1]);
            }
            else {
                substrings.splice(i, 0, "");
            }
        }

        var src = substrings[i].trim();
        if (src.length) {
            substrings[i] = execSync.exec(
                phantomPath + " " +
                renderJsPath + " " +
                renderHtmlPath + " " +
                "'" + JSON.stringify(options) + "' " +
                "'" + src.replace("'", "\\'") + "'"
            ).stdout;
        }
    }

    data.contents = new Buffer(substrings.join(""));
}
