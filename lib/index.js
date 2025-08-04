const useStoreSelectors = require('./rules/use-store-selectors');

module.exports = {
  rules: {
    'use-store-selectors': useStoreSelectors,
  },
  configs: {
    recommended: {
      plugins: ['zustand-selectors'],
      rules: {
        'zustand-selectors/use-store-selectors': 'error',
      },
    },
  },
};
