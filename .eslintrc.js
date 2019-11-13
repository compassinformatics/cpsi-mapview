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
        "LegendUtil": false,
        "GeoStylerSLDParser": false,
        "GeoStylerOpenlayersParser": false,
        "google": false
    },
    "parserOptions": {
        "ecmaVersion": 5
    },
    "rules": {
        "no-trailing-spaces": "error",
        "indent": [
            "error",
            4
        ],
        //"linebreak-style": [
        //    "error",
        //    "unix"
        //],
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
