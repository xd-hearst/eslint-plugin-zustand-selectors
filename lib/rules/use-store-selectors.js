module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce the use of selectors when accessing Zustand store state',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          ignoreTestingFunctions: {
            type: 'array',
            items: { type: 'string' },
            default: ['renderHook', 'act', 'waitFor'],
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      useSelector: 'Use a selector function when accessing Zustand store state. Instead of `{{storeName}}()`, use `{{storeName}}(state => state.property)` to prevent unnecessary re-renders',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const ignoreTestingFunctions = options.ignoreTestingFunctions || ['renderHook', 'act', 'waitFor'];

    // Helper function to check if the store call is inside a testing function
    function isInsideTestingFunction(node) {
      let parent = node.parent;
      
      while (parent) {
        // Check if we're inside a function call that's a testing function
        if (parent.type === 'CallExpression' && 
            parent.callee.type === 'Identifier' &&
            ignoreTestingFunctions.includes(parent.callee.name)) {
          return true;
        }
        
        // Check if we're inside an arrow function that's passed to a testing function
        if (parent.type === 'ArrowFunctionExpression' && 
            parent.parent && 
            parent.parent.type === 'CallExpression' &&
            parent.parent.callee.type === 'Identifier' &&
            ignoreTestingFunctions.includes(parent.parent.callee.name)) {
          return true;
        }
        
        parent = parent.parent;
      }
      
      return false;
    }

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
              // Skip if we're inside a testing function
              if (isInsideTestingFunction(node)) {
                return;
              }
              
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
