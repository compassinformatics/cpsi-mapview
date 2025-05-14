exports.handlers = {
    /**
     * Intercepts and pre-processes the source code before JSDoc parses it.
     * Extracts the object passed to `Ext.define` and replaces it with
     * a "class-like" syntax for JSDoc to parse.
     */
    beforeParse(e) {
        // console.log(e.filename);
        // console.log(e.source);

        const defineRegex = /\nExt\.define/g;
        const matchCount = (e.source.match(defineRegex) || []).length;

        // console.log(`Number of Ext.define classes: ${matchCount}`);

        if (matchCount === 1) {
            const classRegex =
                /\nExt\.define\(['"]([^'"]+)['"],\s*(\{[\s\S]*.*\})\);/g;
            e.source = e.source.replace(
                classRegex,
                (match, className, classBody) => {
                    //console.log(className);
                    //console.log(classBody);

                    const extractedClass = `${className} = ${classBody};`;

                    // Log the transformation for debugging
                    // console.log(extractedClass);
                    return extractedClass;
                }
            );
        } else {
            return e.source;
        }
    }
};
