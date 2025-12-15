const noInternalImport = require('./rules/no-internal-import');
const maxTsxProps = require('./rules/max-tsx-props');

module.exports = {
  rules: {
    'no-internal-import': noInternalImport,
    'max-tsx-props': maxTsxProps,
  },
};
