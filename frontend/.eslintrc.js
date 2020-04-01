module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:prettier/recommended",
        "prettier/@typescript-eslint"
    ],
    overrides: [
        {
            files: ["**/*.tsx"],
            rules: {
                "react/prop-types": "off"
            }
        }
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint",
        "react-hooks"
    ],
    "rules": {
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "@typescript-eslint/camelcase": ["error", { "properties": "never" }],
        "@typescript-eslint/explicit-function-return-type": 0,
        "@typescript-eslint/no-explicit-any": 0,
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "prettier/prettier": ["error", { printWidth: 120 }]
    }
};