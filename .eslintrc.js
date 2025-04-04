module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended', // Подключает Prettier для стиля кодирования
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                vars: 'all',
                args: 'after-used',
                ignoreRestSiblings: false,
                argsIgnorePattern: '^_', // Игнорировать параметры, начинающиеся с "_"
            },
        ],
        '@typescript-eslint/no-explicit-any': 'error', // Запрещает использование "any"
        '@typescript-eslint/explicit-function-return-type': 'error', // Обязательна явная типизация возвращаемого значения функций
        '@typescript-eslint/explicit-module-boundary-types': 'error', // Обязательна явная типизация всех границ модуля
        '@typescript-eslint/semi': ['error', 'always'], // Требуется точка с запятой в конце строк
        'prettier/prettier': [
            'error',
            {
                singleQuote: true, // Используем одинарные кавычки
                trailingComma: 'all', // Добавляем запятую в последнем элементе в массиве/объекте
                printWidth: 80, // Максимальная длина строки
                semi: true, // Обязательная точка с запятой
            },
        ],
    },
};
