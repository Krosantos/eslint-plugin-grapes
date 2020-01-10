const BAD_IMPORT_REGEX = /(\.{1,2}\/)\w+\//g

const create = function (context) {
    return {
        ImportDeclaration(node) {
            if (!node || !node.source || !node.source.value) return;
            if (node.source.value.match(BAD_IMPORT_REGEX))
                context.report({
                    node,
                    message: "Don't attempt to import another module's internal files or functionality.",
                });
        }
    };
};

const meta = {
    type: 'suggestion',
    docs: {
        description:'You should not access another "unit"\'s internal files or functions.',
        category: 'Best Practices',
        recommended: true,
    }
}

module.exports = {
    create,
    meta
}