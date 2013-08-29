(function (name, context, definition) {
  if (typeof module !== 'undefined' && module.exports) { module.exports = definition(); }
  else if (typeof define === 'function' && define.amd) { define(definition); }
  else { context[name] = definition(); }
}('fence', this, function() {

    var fencedClass = 'fenced';
    var polyfilledClass = 'fenced-polyfilled';

    var resizeEvery = 1000; // milliseconds
    var resizeTimes = 5;

    function done(el) {
        // We need to yield before setting those, for some reason
        setTimeout(function() {
            normalizeIframe(el);
        }, 0);

        var count = 0;
        // TODO: use an exponential waiting window instead
        var timer = setInterval(function() {
            if (count === resizeTimes) {
                clearInterval(timer);
            }
            count++;

            resizeIframe(el);
        }, resizeEvery);

        resizeIframe(el);
    }

    // function embedIsTooLarge(iframe) {
    //     var embedWidth = iframe.getAttribute('data-embed-width');
    //     return embedWidth && embedWidth > window.innerWidth;
    // }

    function replaceElement(elToRemove, elToInsert) {
        if (elToRemove.nextSibling) {
            elToRemove.parentNode.insertBefore(elToInsert, elToRemove.nextSibling);
        } else {
            elToRemove.parentNode.appendChild(elToInsert);
        }
        elToRemove.parentNode.removeChild(elToRemove);
    }

    function hasClass(element, className) {
        if (element.classList) {
            return element.classList.contains(className);
        } else {
            // Slightly more brittle...
            return element.className.indexOf(className) !== -1;
        }
    }

    function addClass(element, className) {
        if (element.classList) {
            return element.classList.add(className);
        } else {
            return element.className += ' ' + className;
        }
    }

    function renderAll() {
        // Get all embed iframes that have not been fully rendered yet.
        // TODO: backward compat?
        var selector = 'iframe.' + fencedClass+ ':not(.' + polyfilledClass + ')';
        var iframes = document.querySelectorAll(selector);

        for (var i = 0, l = iframes.length; i < l; ++i) {
            render(iframes[i]);
        }
    }

    function render(iframe, options) {
        options = options || {};

        // Must only be run on <iframe>s with fenced class
        if (! iframe.tagName === 'IFRAME') {
            throw new Error('Cannot render non-iframe elements!');
        }
        if (! hasClass(iframe, fencedClass)) {
            throw new Error('Cannot render iframes with no ' + fencedClass + ' class!');
        }

        // if already polyfilled, nothing to be done (unless forced)
        if (hasClass(iframe, polyfilledClass) && ! options.force) {
            return;
        }

        // FIXME: uh? use width as min width instead?
        // if (embedIsTooLarge(iframe)) {
        //     var p = document.createElement('p');
        //     var message = "embed is too large";
        //     var embedURL = iframe.getAttribute('data-embed-url');
        //     if (embedURL) {
        //         message = "<a href='" + embedURL + "'>View embedded content</a>";
        //     }
        //     p.innerHTML = message;
        //     replaceElement(iframe, p);
        //     return;
        // }

        iframe.style.height = 0;
        iframe.frameBorder = 0;
        iframe.style.border = 'none';
        iframe.width = '100%';

        var supportsSrcdoc = !!iframe.srcdoc;
        if (supportsSrcdoc) {
            // srcdoc is supported, add done listener
            if (iframe.contentWindow.document.readyState === 'complete') {
                done(iframe);
            } else {
                iframe.addEventListener('load', function() {
                    done(iframe);
                }, false);
            }
        } else {
            // If there's no srcdoc support write the src directly into the iframe.
            var src = iframe.getAttribute('srcdoc');
            if (src && typeof src === 'string') {
                iframe.contentWindow.contents = src;
                iframe.src = 'javascript:window["contents"]';
                done(iframe);
            }
        }

        addClass(iframe, polyfilledClass);
    }

    function normalizeIframe(iframe) {
        var body = iframe.contentWindow.document.body;
        body.style.padding = 0;
        body.style.margin = 0;
    }

    function resizeIframe(iframe) {
        var doc = iframe.contentWindow && iframe.contentWindow.document;
        if (doc) {
            var height = doc.height || doc.body.offsetHeight;
            iframe.style.height = height + 'px';
        }
    }

    return {
        render: render,
        renderAll: renderAll
    };
}));
