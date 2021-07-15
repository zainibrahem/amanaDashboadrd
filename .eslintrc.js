module.exports = {
  env: {
    node: true,
    es6: true,
    browser: true,
  },

  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      modules: true,
      experimentalObjectRestSpread: true,
    },
  },
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'off' : 'off',

    // Best Practices
    eqeqeq: 'off',
    'no-invalid-this': 'off',
    'no-return-assign': 'off',
    'no-unused-expressions': ['off', { allowTernary: true }],
    'no-useless-concat': 'off',
    'no-useless-return': 'off',

    // Variable
    // 'init-declarations': 'off',
    'no-use-before-define': 'off',

    // Stylistic Issues
    'array-bracket-newline': ['off', { multiline: true, minItems: null }],
    'array-bracket-spacing': 'off',
    'brace-style': ['off', '1tbs', { allowSingleLine: true }],
    'block-spacing': 'off',
    'comma-dangle': 'off',
    'comma-spacing': 'off',
    'comma-style': 'off',
    'computed-property-spacing': 'off',
    'func-call-spacing': 'off',
    'implicit-arrow-linebreak': ['off', 'beside'],
    // indent: ['off', 4],
    'keyword-spacing': 'off',
    'multiline-ternary': ['off', 'never'],
    // 'no-lonely-if': 'off',
    'no-mixed-operators': 'off',
    'no-multiple-empty-lines': ['off', { max: 2, maxEOF: 1 }],
    'no-tabs': 'off',
    'no-unneeded-ternary': 'off',
    'no-whitespace-before-property': 'off',
    'nonblock-statement-body-position': 'off',
    'object-property-newline': ['off', { allowAllPropertiesOnSameLine: true }],
    'quote-props': ['off', 'as-needed'],
    // quotes: ['off', 'prefer-single'],
    semi: ['off', 'never'],
    'semi-spacing': 'off',
    'space-before-blocks': 'off',
    // 'space-before-function-paren': 'off',
    'space-in-parens': 'off',
    'space-infix-ops': 'off',
    'space-unary-ops': 'off',

    // ES6
    'arrow-spacing': 'off',
    'no-confusing-arrow': 'off',
    'no-duplicate-imports': 'off',
    'no-var': 'off',
    'object-shorthand': 'off',
    'prefer-const': 'off',
    'prefer-template': 'off',
  },

  // rules: {
  //   'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'off',
  //   'no-debugger': process.env.NODE_ENV === 'production' ? 'off' : 'off',
  //   semi: ['off', 'never'],
  //   'max-len': 'off',
  //   camelcase: ['off', { properties: 'never', ignoreDestructuring: true, ignoreImports: true }]
  // }
};
