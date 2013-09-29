# Fence -- safer sandbox for embedding code

rationale

use iframe, srcdoc
polyfill

## Usage

The fence library is distributed as an AMD module, so make sure you
are using an AMD loader, for instance
[RequireJS](http://requirejs.org/), and use it to load in the library:

```
require(['fence'], function(fence) {
  // use fence as per the instructions below...
});
```

To wrap any HTML code into a fenced iframe, pass it to the `wrap`
function:

```
var iframe = '<script src="http://example.com/script.js"></script>';
var embedHtml = fence.wrap(iframe);

// you can then add it to your page, e.g.
someContainer.innerHTML = embedHtml;
```

Note that the code will only be wrapped if it is unsafe (i.e. risks of
destructive or averse side-effects).  If it is safe (e.g. it's already
an iframe), it will just be returned as-is.

If you just want to check if some HTML is safe to embed, use
`isSafeCode`:

```
var iframe = '<iframe src="http://example.com/iframe"></iframe>';
fence.isSafeCode(); // => true

var iframe = '<script src="http://example.com/script.js"></script>';
fence.isSafeCode(); // => false
```

Once you have a fenced iframe in your page, you can render it by
passing its DOM node or id to the `render` function:

```
// Render using a reference to the node
var node = document.querySelector('.content iframe.fenced');
fence.render(node);

// ... or just by id, assuming you have:
//  <iframe id="some-fenced-iframe" class="fenced" srcdoc="..."></iframe>
fence.render('some-fenced-iframe');
```

If you just want to render all fenced iframes on the page, you can
simply call:

```
fence.renderAll();
```


## Installation

The easiest way to install fence to use in your web application is
through [Bower](http://bower.io/):

```
$ bower install fence
```

Then simply point your AMD config to the fence.js file and you're
ready to go!


## Examples

To try the examples locally, simply run:

```
$ npm install
$ grunt connect
```

Then open http://localhost:9001/examples/ in your browser.


## I'm not so sure...

It all sounds a little bit crazy.  Does it actually work?

Yes it does.  It was developed for and is being used on
[the Guardian website](http://www.theguardian.com/).


url?
polyfill


browser support

tests
travis