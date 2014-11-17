var path = require("path");
var debug = require("debug")("metalsmith-vextab");
var phantom = require("phantom");

module.exports = plugin;

function plugin(options) {
    options = options || {};
    options.startDelimiter = options.startDelimiter || "<vextab>";
    options.endDelimiter = options.endDelimiter || "</vextab>";
    options.width = options.width || 600;
    options.logo = !!options.logo;
	
    return function (files, metalsmith, done) {
        var fileNames = Object.keys(files);
        if (!fileNames.length) {
            done();
            return;
        }
        
        // Launch a single PhantomJS process and
        // create a single web pagefor all files
        phantom.create(function (ph) {
            ph.createPage(function (page) {
                page.open(path.join(__dirname, "render.html"), function (status) {
                    fileNames.forEach(function (fileName, index) {
                        debug("Converting file: %s", fileName);

                        // The PhantomJS bridge is asynchronous.
                        // The last conversion will trigger a callback
                        // that closes the web page and completes this plugin.
                        convert(files[fileName], options, page, function () {
                            if (index === fileNames.length - 1) {
                                page.close();
                                ph.exit();
                            }
                        });
                    });
                });
            });
        }, {
            onExit: done
        });
    };
}

function convert(data, options, page, done) {
    // Split the string at the start delimiters
    var substrings = data.contents.toString().split(options.startDelimiter);
    if (substrings.length < 2) {
        done();
        return;
    }

    page.evaluate(function (substrings, options) {
        var div = document.querySelector("div");
        var renderer = new Vex.Flow.Renderer(div, Vex.Flow.Renderer.Backends.RAPHAEL);
        var artist = new Vex.Flow.Artist(0, 0, options.width);
        Vex.Flow.Artist.NOLOGO = !options.logo;
        var vextab = new Vex.Flow.VexTab(artist);

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

            var vextabSrc = substrings[i].trim();

            if (vextabSrc.length) {
                vextab.reset();
                artist.reset();
                vextab.parse(vextabSrc);
                artist.render(renderer);
                substrings[i] = div.innerHTML;
            }
        }

        return substrings.join("");
    }, function (contents) {
        data.contents = new Buffer(contents);
        done();
    }, substrings, options);
}
