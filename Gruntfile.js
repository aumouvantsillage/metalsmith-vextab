module.exports = function(grunt) {

    var glob = require('glob');

    // Ordered list of Vexflow source files. If you have dependencies
    // between files, order them here.
    var vexflowSources = [
        "vexflow/src/vex.js",
        "vexflow/src/flow.js",
        "vexflow/src/fraction.js",
        "vexflow/src/tables.js",
        "vexflow/src/fonts/vexflow_font.js",
        "vexflow/src/glyph.js",
        "vexflow/src/stave.js",
        "vexflow/src/staveconnector.js",
        "vexflow/src/tabstave.js",
        "vexflow/src/tickcontext.js",
        "vexflow/src/tickable.js",
        "vexflow/src/note.js",
        "vexflow/src/notehead.js",
        "vexflow/src/stem.js",
        "vexflow/src/stemmablenote.js",
        "vexflow/src/stavenote.js",
        "vexflow/src/tabnote.js",
        "vexflow/src/ghostnote.js",
        "vexflow/src/clefnote.js",
        "vexflow/src/timesignote.js",
        "vexflow/src/beam.js",
        "vexflow/src/voice.js",
        "vexflow/src/voicegroup.js",
        "vexflow/src/modifier.js",
        "vexflow/src/modifiercontext.js",
        "vexflow/src/accidental.js",
        "vexflow/src/dot.js",
        "vexflow/src/formatter.js",
        "vexflow/src/stavetie.js",
        "vexflow/src/tabtie.js",
        "vexflow/src/tabslide.js",
        "vexflow/src/bend.js",
        "vexflow/src/vibrato.js",
        "vexflow/src/annotation.js",
        "vexflow/src/articulation.js",
        "vexflow/src/tuning.js",
        "vexflow/src/stavemodifier.js",
        "vexflow/src/keysignature.js",
        "vexflow/src/timesignature.js",
        "vexflow/src/clef.js",
        "vexflow/src/music.js",
        "vexflow/src/keymanager.js",
        "vexflow/src/renderer.js",
        "vexflow/src/raphaelcontext.js",
        "vexflow/src/canvascontext.js",
        "vexflow/src/stavebarline.js",
        "vexflow/src/stavehairpin.js",
        "vexflow/src/stavevolta.js",
        "vexflow/src/staverepetition.js",
        "vexflow/src/stavesection.js",
        "vexflow/src/stavetempo.js",
        "vexflow/src/stavetext.js",
        "vexflow/src/barnote.js",
        "vexflow/src/tremolo.js",
        "vexflow/src/tuplet.js",
        "vexflow/src/boundingbox.js",
        "vexflow/src/textnote.js",
        "vexflow/src/frethandfinger.js",
        "vexflow/src/stringnumber.js",
        "vexflow/src/strokes.js",
        "vexflow/src/curve.js",
        "vexflow/src/staveline.js",
        "vexflow/src/crescendo.js",
        "vexflow/src/ornament.js",
        "vexflow/src/pedalmarking.js",
        "vexflow/src/textbracket.js",
        "vexflow/src/textdynamics.js"
    ];

    // Don't minify these files.
    var vexflowReject = [
        "vexflow/src/header.js",
        "vexflow/src/container.js"
    ];

    // Catch other missing JS files
    glob.sync("vexflow/src/*.js").forEach(function (file) {
        if (vexflowSources.indexOf(file) < 0 && vexflowReject.indexOf(file) < 0) {
            vexflowSources.push(file);
        }
    });

    vextabGeneratedSources = [
        "build/vextab_parser.js",
        "build/tabdiv2.js",
        "build/artist.js",
        "build/vextab.js"
    ];

    grunt.initConfig({
        coffee: {
            vextab: {
                expand: true,
                flatten: true,
                src: ["vextab/src/*.coffee"],
                dest: "build/",
                ext: ".js"
            }
        },
        
        jison: {
            vextab: {
                options: {
                    moduleName: "vextab_parser"
                },
                files: {
                    "build/vextab_parser.js": "vextab/src/vextab.jison"
                }
            }
        },
        
        uglify: {
            vexflow: {
                options: {
                    banner: grunt.file.read("vexflow/src/header.js", { encoding: "utf-8" })
                },
                files: {
                    "vendor/vexflow-min.js": vexflowSources
                }
            },
            vextab: {
                files: {
                    "vendor/tabdiv-min.js": vextabGeneratedSources
                }
            }
        }
    });
  
    grunt.loadNpmTasks("grunt-contrib-coffee");
    grunt.loadNpmTasks("grunt-jison");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default", ["coffee", "jison", "uglify"]);
};
