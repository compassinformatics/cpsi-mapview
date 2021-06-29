/**
 * A mixin for an editing windows providing formulas that can be bound
 * to the window model
 *
 * @class CpsiMapview.util.EditWindowViewModelMixin
 */
Ext.define('CpsiMapview.util.EditWindowViewModelMixin', {
    extend: 'Ext.Mixin',

    mixinConfig: {
        before: {
            destroy: 'destroyUtil'
        },
        after: {
            initConfig: 'onInitConfig'
        }
    },

    /**
     * Destroy the currently associated record
     * */
    destroyUtil: function () {
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
        me.set('currentRecord', null);
    },

    config: {

        formulas: {

            resultLayer: {
                bind: {
                    currentRecord: '{currentRecord}'
                },
                get: function () {
                    var me = this;
                    var storeName = me.get('featureStoreName');
                    var currentRecord = me.get('currentRecord');
                    var fs = me.getFeatureStore(currentRecord, storeName);

                    // when a model is reloaded then the featureStore and layer
                    // is recreated, and the tool is pointing to the old layer
                    // TODO fix this for all tool types
                    // see bindings in CpsiMapview.util.EditFormWindowMixin
                    var pointTool = me.getView().down('#pointDigitiserButton');
                    if (pointTool) {
                        var toolCtrl = pointTool.getController();
                        toolCtrl.setResultLayer(fs.layer);
                        toolCtrl.setDrawLayer(fs.layer);
                    }

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

            canSave: {
                bind: {
                    currentRecord: '{currentRecord}',
                    isValid: '{valid}'
                },
                get: function (data) {
                    var ret = data.isValid;
                    ret = ret && (data.isLocked !== true);
                    ret = ret && this.getFormulas().belongsToRoleReadWrite.call(this, this.getFormulaFn);
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
                    ret = ret && this.getFormulas().belongsToRoleReadWrite.call(this, this.getFormulaFn);
                    return ret;
                }
            },

            canRefresh: {
                bind: {
                    currentRecord: '{currentRecord}',
                    phantom: '{currentRecord.phantom}'
                },
                get: function (data) {
                    return !data.currentRecord.isPhantom();
                }
            }
        }
    }
});