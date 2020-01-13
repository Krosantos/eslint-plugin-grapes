const fs = require('fs');
const path = require('path');
const IMPORT_PREFIX = /(\.\.\/)+|(\.\/)+/
const BAD_IMPORT_REGEX = /(\.{1,2}\/)\w+\//g
const INDEX_FILE_REGEX = /^index\..*$/g

const importIsModule = (importPath, contextPath) => {
    const prefix = importPath.match(IMPORT_PREFIX)[0];
    const pathSuffix = importPath.replace(prefix, '');
    const split = pathSuffix.split('/');
    while (split.length > 1) {
        split.pop();
        const me = path.parse(contextPath);
        const it = prefix + split.join(path.sep);
        const resolvedPath = path.resolve(me.dir, it);
        try {
            const files = fs.readdirSync(resolvedPath);
            const hasIndexFile = files.some(file => {
                const match = file.match(INDEX_FILE_REGEX)
                return !!match
            })
            if (hasIndexFile) return true;
        } catch {
            return true
        }
    }
}

const create = function (context) {
    return {
        ImportDeclaration(node) {
            if (!node || !node.source || !node.source.value) return;
            const importPath = node.source.value;
            if (!importPath.match(BAD_IMPORT_REGEX)) return;
            const isModule = importIsModule(importPath, context.getFilename())

            if (isModule) {
                context.report({
                    node,
                    message: "Do not import another module's internal files or functionality.",
                });
            }
        }
    };
};

const meta = {
    type: 'suggestion',
    docs: {
        description: 'You should not access another "unit"\'s internal files or functions.',
        category: 'Best Practices',
        recommended: true,
    }
}

module.exports = {
    create,
    meta
}
