module.exports = {
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020
    },
    extends: ['prettier'],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': ['error']
    }
};
