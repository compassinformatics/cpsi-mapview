import globals from 'globals';
import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';

export default [
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
                ol: false,
                Ext: false,
                proj4: false,
                BasiGX: false,
                GeoExt: false,
                CpsiMapview: false,
                LayerFactory: false,
                LegendUtil: false,
                GeoStylerSLDParser: false,
                GeoStylerOpenlayersParser: false,
                google: false,
                XLink_1_0: false,
                ISO19139_GMD_20060504: false,
                ISO19139_GCO_20060504: false,
                ISO19139_GTS_20060504: false,
                ISO19139_GSS_20060504: false,
                ISO19139_GSR_20060504: false,
                GML_3_2_0: false,
                Jsonix: false,
                turf: false,
                describe: false,
                // for test suite
                sinon: false,
                it: false,
                beforeEach: false,
                afterEach: false,
                before: false,
                afterAll: false,
                expect: false
            }
        },
        plugins: {
            prettier
        },
        rules: {
            ...js.configs.recommended.rules,
            'no-var': 'error',
            'prefer-const': 'warn',
            'prettier/prettier': 'error'
        }
    }
];
