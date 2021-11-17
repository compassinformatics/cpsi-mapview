module.exports = {
    "env": {
        "browser": true,
        "es6": true // to allow Uint8Array
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
        "google": false,
        "XLink_1_0": false,
        "ISO19139_GMD_20060504": false,
        "ISO19139_GCO_20060504": false,
        "ISO19139_GTS_20060504": false,
        "ISO19139_GSS_20060504": false,
        "ISO19139_GSR_20060504": false,
        "GML_3_2_0": false,
        "Jsonix": false
    },
    "parserOptions": {
        "ecmaVersion": 5
    },
    "rules": {
        "no-trailing-spaces": "error",
        "indent": [
            "error",
            4,
            { "SwitchCase": 1 }
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
