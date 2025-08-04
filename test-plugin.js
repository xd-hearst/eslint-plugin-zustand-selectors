const { ESLint } = require('eslint');
const plugin = require('./lib/index');

async function testPlugin() {
  const eslint = new ESLint({
    baseConfig: {
      plugins: ['zustand-selectors'],
      rules: {
        'zustand-selectors/use-store-selectors': 'error',
      },
    },
    useEslintrc: false,
  });

  // Test code that should trigger the rule
  const code = `
const useMyStore = create(() => ({ count: 0 }));

function MyComponent() {
  const store = useMyStore(); // This should trigger the rule
  return <div>{store.count}</div>;
}
`;

  try {
    const results = await eslint.lintText(code, { filePath: 'test.js' });
    console.log('ESLint results:', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Error running ESLint:', error);
  }
}

// Register the plugin
ESLint.outputFixes = () => {};
const eslint = new ESLint({
  plugins: {
    'zustand-selectors': plugin,
  },
});

testPlugin();
