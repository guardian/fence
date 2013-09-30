# Fence – safer embed sandbox

Fence provides a safer way to embed custom code on a website.

Embedding third-party HTML onto a website can endanger the stability
of a page, e.g. by calling destructive web APIs (`document.write`) or
triggering JavaScript errors.  They sometimes expect to be present in
the page on load in order to load scripts synchronously, though you
may want to inject them dynamically.

This library provides a safer abstraction to wrap custom code and
render it on demand.

Fence uses `<iframe>` as sandboxing mechanism, through the
[srcdoc](http://www.whatwg.org/specs/web-apps/current-work/multipage/the-iframe-element.html#attr-iframe-srcdoc)
attribute (polyfilled for older browsers).

Note that fence does not improve security (the sandboxed code still
runs on the same origin), only the reliability of the embedded
content.


## Usage

The fence library is distributed as an AMD module, so make sure you
are using an AMD loader, for instance
[RequireJS](http://requirejs.org/), and use it to load in the library:

```javascript
require(['fence'], function(fence) {
  // use fence as per the instructions below...
});
```

To wrap any HTML code into a fenced iframe, pass it to the `wrap`
function:

```javascript
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

```javascript
var iframe = '<iframe src="http://example.com/iframe"></iframe>';
fence.isSafeCode(); // => true

var iframe = '<script src="http://example.com/script.js"></script>';
fence.isSafeCode(); // => false
```

Once you have a fenced iframe in your page, you can render it by
passing its DOM node or id to the `render` function:

```javascript
// Render using a reference to the node
var node = document.querySelector('.content iframe.fenced');
fence.render(node);

// ... or just by id, assuming you have:
//  <iframe id="some-fenced-iframe" class="fenced" srcdoc="..."></iframe>
fence.render('some-fenced-iframe');
```

If you just want to render all fenced iframes on the page, you can
simply call:

```javascript
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


## FAQ

### Does it actually work?

Yes it does.  It was developed for and is being used on
[the Guardian website](http://www.theguardian.com/).

### What is the browser support

Fence has been tested on the following browsers:

* Firefox
* Chrome
* IE (9+)
