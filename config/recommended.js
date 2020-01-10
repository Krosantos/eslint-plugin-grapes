module.exports = {
    plugins: ['grapes'],

    rules: {
        'grapes/no-broken-grapes': 'error'
    },
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2018,
    },
}