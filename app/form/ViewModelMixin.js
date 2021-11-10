/**
 * A mixin for an editing windows providing formulas that can be bound
 * to the window model
 *
 * @class CpsiMapview.form.ViewModelMixin
 */
Ext.define('CpsiMapview.form.ViewModelMixin', {
    extend: 'Ext.Mixin',

    requires: [
        'BasiGX.util.Map'
    ],

    mixinConfig: {
        before: {
            destroy: 'destroyCurrentRecord'
        },
        after: {
            initConfig: 'onInitConfig'
        }
    },

    /**
     * Destroy the currently associated record
     * */
    destroyCurrentRecord: function () {
        var me = this;
        var rec = me.get('currentRecord');
        rec.destroy();
    },

    /**
     * Get a featurestore from the current record
     * @param {any} currentRecord
     * @param {any} storeName
     */
    getFeatureStore: function (currentRecord, storeName) {
        if (currentRecord && currentRecord.featureStores) {
            return currentRecord.featureStores[storeName];
        }
    },

    onInitConfig: function () {
        var me = this;
        // add the currentRecord property which is used for all data entry forms
        me.set({
            'currentRecord': null,
            'timestamp': Ext.Date.now()
        });
    },

    config: {

        formulas: {

            map: function () {
                var cmp = BasiGX.util.Map.getMapComponent();
                if (cmp) {
                    return cmp.getMap();
                }
                else {
                    return null;
                }
            },

            resultLayer: {
                bind: {
                    currentRecord: '{currentRecord}'
                },
                get: function () {
                    var me = this;
                    var storeName = me.get('featureStoreName');
                    var currentRecord = me.get('currentRecord');
                    var fs = me.getFeatureStore(currentRecord, storeName);
                    if (fs) {
                        return fs.layer;
                    }
                }
            },

            polygonLayer: {
                bind: {
                    currentRecord: '{currentRecord}'
                },
                get: function () {

                    var me = this;
                    var storeName = me.get('polygonStoreName');
                    var currentRecord = me.get('currentRecord');
                    var fs = me.getFeatureStore(currentRecord, storeName);
                    if (fs) {
                        return fs.layer;
                    }
                }
            },

            selectStyle: {
                bind: {
                    resultLayer: '{resultLayer}'
                },
                get: function (data) {
                    var layer = data.resultLayer;
                    return layer.get('selectStyle');
                }
            },

            /**
            * This is overwritten in most of the ViewModels that use this mixin
            * @param {any} get
            */
            valid: function (get) {
                return true;
            },

            canSave: {
                bind: {
                    currentRecord: '{currentRecord}',
                    isLocked: '{currentRecord.isLocked}',
                    isValid: '{valid}'
                },
                get: function (data) {
                    var ret = data.isValid;
                    ret = ret && (data.isLocked !== true);
                    if (this.getFormulas().belongsToRoleReadWrite) {
                        ret = ret && this.getFormulas().belongsToRoleReadWrite.call(this, this.getFormulaFn);
                    }
                    return ret;
                }
            },

            canDelete: {
                bind: {
                    currentRecord: '{currentRecord}',
                    phantom: '{currentRecord.phantom}'
                },
                get: function (data) {
                    var ret = (data.isLocked !== true) && !data.phantom;
                    if (this.getFormulas().belongsToRoleReadWrite) {
                        ret = ret && this.getFormulas().belongsToRoleReadWrite.call(this, this.getFormulaFn);
                    }
                    return ret;
                }
            },

            canRefresh: {
                bind: {
                    currentRecord: '{currentRecord}',
                    phantom: '{currentRecord.phantom}'
                },
                get: function (data) {
                    if (!data.currentRecord || !data.currentRecord.isPhantom) {
                        return false;
                    }
                    return !data.currentRecord.isPhantom();
                }
            },

            canExport: {
                bind: {
                    currentRecord: '{currentRecord}',
                    phantom: '{currentRecord.phantom}'
                },
                get: function (data) {
                    if (!data.currentRecord || !data.currentRecord.isPhantom) {
                        return false;
                    }
                    return !data.currentRecord.isPhantom();
                }
            }
        }
    }
});