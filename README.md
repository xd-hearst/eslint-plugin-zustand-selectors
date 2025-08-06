# eslint-plugin-zustand-selectors

ESLint plugin to enforce the use of selectors when accessing Zustand store state to prevent unnecessary re-renders.

## Installation

```bash
npm install eslint-plugin-zustand-selectors --save-dev
```

## Usage

Add `zustand-selectors` to the plugins section of your `.eslintrc` configuration file:

```json
{
  "plugins": ["zustand-selectors"]
}
```

Then configure the rules you want to use under the rules section:

```json
{
  "rules": {
    "zustand-selectors/use-store-selectors": "error"
  }
}
```

Or use the recommended configuration:

```json
{
  "extends": ["plugin:zustand-selectors/recommended"]
}
```

## Rules

### `use-store-selectors`

Enforces the use of selector functions when accessing Zustand store state to prevent unnecessary re-renders.

#### ❌ Incorrect

```javascript
const useMyStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// This will cause unnecessary re-renders
const MyComponent = () => {
  const store = useMyStore(); // ❌ No selector function
  return <div>{store.count}</div>;
};
```

#### ✅ Correct

```javascript
const useMyStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// This will only re-render when count changes
const MyComponent = () => {
  const count = useMyStore(state => state.count); // ✅ Using selector
  return <div>{count}</div>;
};

// ✅ Also correct - testing scenarios are automatically ignored
const { result } = renderHook(() => useMyStore()); // No error in tests
```

#### Configuration

The rule can be configured with the following options:

```json
{
  "rules": {
    "zustand-selectors/use-store-selectors": [
      "error",
      {
        "ignoreTestingFunctions": ["renderHook", "act", "waitFor"]
      }
    ]
  }
}
```

##### Options

- `ignoreTestingFunctions` (array): List of function names that should be ignored when checking for selector usage. Default: `["renderHook", "act", "waitFor"]`

#### Testing Support

The rule automatically ignores store calls inside common testing functions to avoid false positives:

```javascript
// ✅ These won't trigger the rule
const { result } = renderHook(() => useMyStore());

act(() => {
  const store = useMyStore();
  store.increment();
});

await waitFor(() => {
  const store = useMyStore();
  expect(store.count).toBe(1);
});
```

## Why Use Selectors?

When you call a Zustand store hook without a selector function, your component will re-render whenever **any** part of the store state changes, even if your component doesn't use that part of the state.

By using selector functions, you ensure that your component only re-renders when the specific data it depends on actually changes, leading to better performance.

## License

MIT
