const NoBrokenGrapes = function (context) {
    return {
        ImportDeclaration(node) {
            console.log(node)
            console.log(node.source)
            context.report({
                node,
                message: 'I am a flag. I flag you.',
            });
        }
    };
};

module.exports = NoBrokenGrapes