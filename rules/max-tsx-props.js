const DEFAULT_PROP_COUNT = 8;

const create = function (context) {
  let maxProps = DEFAULT_PROP_COUNT;
  const options = context.options ?? [];
  if (options.length > 0) {
    const { max } = options[0];
    maxProps = max;
  }

  const typeLengths = {};

  return {
    TSInterfaceDeclaration(node) {
      const interfaceName = node.id.name;
      const propCount =
        node?.body?.body?.filter((t) => t.type === 'TSPropertySignature')?.length ?? 0;
      typeLengths[interfaceName] = propCount;
    },
    TSTypeAliasDeclaration(node) {
      const typeName = node.id.name;
      const propCount =
        node?.typeAnnotation?.members?.filter((t) => t.type === 'TSPropertySignature')
          ?.length ?? 0;
      typeLengths[typeName] = propCount;
    },
    Identifier(node) {
      if (node.name !== 'FC') return;
      const referencedName =
        node?.parent?.parent?.typeArguments?.params?.[0]?.typeName?.name;
      const propCount = typeLengths[referencedName] ?? 0;
      if (propCount > maxProps) {
        context.report({
          node: node?.parent?.parent?.typeArguments?.params?.[0],
          message: `This component takes too many props. ${referencedName} has ${propCount} props, but the maximum is ${maxProps}`,
        });
      }
    },
  };
};

const meta = {
  type: 'suggestion',
  docs: {
    description:
      'A rule to avoid passing an unmanageable number of props into a component.',
    category: 'Best Practices',
    url: 'https://github.com/Krosantos/eslint-plugin-grapes?tab=readme-ov-file#rule-details',
    recommended: true,
  },
  schema: [
    {
      type: 'object',
      properties: {
        max: {
          type: 'number',
          title: 'Prop maximum',
          description:
            'The maximum number of props allowable on destructured `props` for a component.',
          default: DEFAULT_PROP_COUNT,
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
