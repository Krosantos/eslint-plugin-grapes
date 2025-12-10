const fs = require('fs');
const path = require('path');
const IMPORT_PREFIX = /(\.\.\/)+|(\.\/)+/;
const BAD_IMPORT_REGEX = /(\.{1,2}\/)\w+\//g;
const INDEX_FILE_REGEX = /^index\.(j|t)sx?$/g;

const importIsModule = (importPath, contextPath, indexRegex) => {
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
      const hasIndexFile = files.some((file) => {
        const match = file.match(indexRegex);
        return !!match;
      });
      if (hasIndexFile) return true;
    } catch {
      return true;
    }
  }
};

const create = function (context) {
  let indexRegex = INDEX_FILE_REGEX;
  const options = context.options || [];
  if (options.length > 0) {
    const { indexFileRegex } = options[0];
    indexRegex = new RegExp(indexFileRegex);
  }
  return {
    ImportDeclaration(node) {
      if (!node || !node.source || !node.source.value) return;
      const importPath = node.source.value;
      if (!importPath.match(BAD_IMPORT_REGEX)) return;

      const isModule = importIsModule(importPath, context.getFilename(), indexRegex);

      if (isModule) {
        context.report({
          node,
          message: "Do not import another module's internal files or functionality.",
        });
      }
    },
  };
};

const meta = {
  type: 'suggestion',
  docs: {
    description: 'You should not access another "unit"\'s internal files or functions.',
    category: 'Best Practices',
    url: 'https://github.com/Krosantos/eslint-plugin-grapes?tab=readme-ov-file#rule-details',
    recommended: true,
  },
  schema: [
    {
      type: 'object',
      properties: {
        indexFileRegex: {
          type: 'string',
          title: 'Index file regex',
          description: 'The regex used to determine what constitutes an "index" file',
          default: '^index\\.(j|t)sx?$',
        },
      },
      additionalProperties: false,
    },
  ],
};

module.exports = {
  create,
  meta,
};
