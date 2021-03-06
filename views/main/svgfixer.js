module.exports = (document) => {
    var baseUrl = window.location.href
        .replace(window.location.hash, "");

    /**
    *  Find all `use` elements with a namespaced `href` attribute, e.g.
    *  <use xlink:href="#some-id"></use>
    *
    *  See: http://stackoverflow.com/a/23047888/796152
    */
    [].slice.call(document.querySelectorAll("use[*|href]"))

        /**
        * Filter out all elements whose namespaced `href` attribute doesn't
        * start with `#` (i.e. all non-relative IRI's)
        *
        * Note: we're assuming the `xlink` prefix for the XLink namespace!
        */
        .filter((element) => {
            if (element.getAttribute('href') !== null) {
                element.setAttribute('xlink:href', element.getAttribute('href'));
            }
            return (element.getAttribute("xlink:href").indexOf("#") === 0);
        })

        /**
        * Prepend `window.location` to the namespaced `href` attribute value,
        * in order to make it an absolute IRI
        *
        * Note: we're assuming the `xlink` prefix for the XLink namespace!
        */
        .forEach((element) => {
            element.setAttribute("xlink:href", baseUrl + element.getAttribute("xlink:href"));
            if (element.getAttribute('href') !== null) {
                element.setAttribute('href', element.getAttribute('xlink:href'));
                element.removeAttribute('xlink:href');
            }
        });

}
