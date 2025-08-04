module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce the use of selectors when accessing Zustand store state',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      useSelector: 'Use a selector function when accessing Zustand store state. Instead of `{{storeName}}()`, use `{{storeName}}(state => state.property)` to prevent unnecessary re-renders',
    },
  },

  create(context) {
    return {
      CallExpression(node) {
        // Check if this is a function call
        if (node.callee.type === 'Identifier') {
          const functionName = node.callee.name;
          
          // Check if it matches Zustand store pattern (starts with 'use' and contains/ends with 'Store')
          if (functionName.startsWith('use') && 
              (functionName.includes('Store') || functionName.endsWith('Store'))) {
            
            // Check if called without arguments (no selector)
            if (node.arguments.length === 0) {
              context.report({
                node,
                messageId: 'useSelector',
                data: {
                  storeName: functionName,
                },
              });
            }
          }
        }
      },
    };
  },
};
