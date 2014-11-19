var args = require("system").args;
var page = require("webpage").create();

var url = args[1]
var options = JSON.parse(args[2]);
var src = args[3];

page.open(url, function (status) {
    var result = page.evaluate(function (options, src) {
        var div = document.querySelector("div");
        var renderer = new Vex.Flow.Renderer(div, Vex.Flow.Renderer.Backends.RAPHAEL);
        var artist = new Vex.Flow.Artist(0, 0, options.width);
        Vex.Flow.Artist.NOLOGO = !options.logo;
        var vextab = new Vex.Flow.VexTab(artist);

        vextab.reset();
        artist.reset();
        vextab.parse(src);
        artist.render(renderer);
        return div.innerHTML;
    }, options, src);
    console.log(result);
    phantom.exit();
});
