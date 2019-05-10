module.exports = {
    "env": {
        "browser": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "ol": false,
        "Ext": false,
        "proj4": false,
        "BasiGX": false,
        "GeoExt": false,
        "CpsiMapview": false,
        "LayerFactory": false,
        "GeoStylerSLDParser": false,
        "GeoStylerOpenlayersParser": false,
        "google": false
    },
    "parserOptions": {
        "ecmaVersion": 5
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
