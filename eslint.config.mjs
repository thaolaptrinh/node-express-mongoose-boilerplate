import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
    pluginJs.configs.recommended,
    {
        languageOptions: { sourceType: 'module' },
    },
    {
        languageOptions: { globals: globals.node },
    },
    {
        rules: {
            'no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
        },
    },
];
