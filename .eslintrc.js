module.exports = {
    parser: '@typescript-eslint/parser', 
    plugins: ['@typescript-eslint'],
    extends: [
      'eslint:recommended', 
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking', 
    ],
    parserOptions: {
      ecmaVersion: 2022, 
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true, 
      },
      project: './tsconfig.json', 
    },
    rules: {

    },
  };
  