metalsmith-vextab
=================

A Metalsmith plugin to render music notation as SVG using [VexTab](http://www.vexflow.com/vextab/).

Installation
------------

    npm install metalsmith-vextab

Usage
-----

VexTab source code can be inserted in a source file between customizable delimiters.
The default start and end delimiters are `<vextab>` and `</vextab>`.

Example:

```html
C major scale:

<vextab>
    tabstave notation=true tablature=false
    notes C-D-E-F-G-A-B/4 C/5
</vextab>
```

This plugin supports the following options:

* `startDelimiter` (string): the delimiter to open a new music block.
* `endDelimiter` (string): the delimiter to close the current music block.
* `logo` (boolean): show the *veflow.com* logo below the rendered musical scores.

For instance, if you want to delimit your VexTab source between `{|` and `|}`,
you can configure this plugin as follows:

### CLI

```json
{
  "plugins": {
    "metalsmith-vextab": {
      "startDelimiter": "{|",
      "endDelimiter": "|}"
    }
  }
}
```

### JavaScript:

```javascript
var vextab = require('metalsmith-vextab');

metalsmith.use(vextab({
  startDelimiter: '{|',
  endDelimiter: '|}'
}));
```

Building
--------

VexTab and VexFlow are not available as node.js modules yet.
We provide a simple, non-official Grunt file that builds VexTab and VexFlow into the `vendor` folder.
