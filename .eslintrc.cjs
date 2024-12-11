module.exports = {
      root: true,
      env: { browser: true, es2020: true },
      extends: [
        'eslint:recommended',
        'plugin:preact/recommended',
      ],
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      settings: { react: { version: 'detect' } },
      plugins: ['preact'],
      ignorePatterns: ['dist', '.eslintrc.cjs'],
      rules: {
        'no-unused-vars': 'warn',
        'no-console': 'warn',
        'preact/no-unknown-prop': 'warn',
      },
    };
