/**
 * A mixin for an editing windows providing formulas that can be bound
 * to the window model
 *
 * @class CpsiMapview.form.ViewModelMixin
 */
Ext.define('CpsiMapview.form.ViewModelMixin', {
    extend: 'Ext.Mixin',

    requires: ['BasiGX.util.Map'],

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
        const me = this;
        const rec = me.get('currentRecord');
        if (rec) {
            rec.destroy();
        }
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
        const me = this;

        const currentRecord = me.get('currentRecord');
        if (currentRecord) {
            me.set({
                timestamp: Ext.Date.now()
            });
        } else {
            // add the currentRecord property which is used for all data entry forms
            me.set({
                currentRecord: currentRecord,
                timestamp: Ext.Date.now()
            });
        }
    },


    config: {
        formulas: {
            map: function () {
                const cmp = BasiGX.util.Map.getMapComponent();
                if (cmp) {
                    return cmp.getMap();
                } else {
                    return null;
                }
            },

            resultLayer: {
                bind: {
                    currentRecord: '{currentRecord}'
                },
                get: function () {
                    const me = this;
                    const storeName = me.get('featureStoreName');
                    const currentRecord = me.get('currentRecord');
                    const fs = me.getFeatureStore(currentRecord, storeName);
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
                    const me = this;
                    const storeName = me.get('polygonStoreName');
                    const currentRecord = me.get('currentRecord');
                    const fs = me.getFeatureStore(currentRecord, storeName);
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
                    const layer = data.resultLayer;
                    if (layer) {
                        return layer.get('selectStyle');
                    } else {
                        return null;
                    }
                }
            },

            /**
             * This is overwritten in most of the ViewModels that use this mixin
             */
            valid: function () {
                return true;
            },

            canSave: {
                bind: {
                    currentRecord: '{currentRecord}',
                    isLocked: '{currentRecord.isLocked}',
                    isValid: '{valid}'
                },
                get: function (data) {
                    let ret = data.isValid;
                    ret = ret && data.isLocked !== true;
                    if (this.getFormulas().belongsToRoleReadWrite) {
                        ret =
                            ret &&
                            this.getFormulas().belongsToRoleReadWrite.call(
                                this,
                                this.getFormulaFn
                            );
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
                    let ret = data.isLocked !== true && !data.phantom;
                    if (this.getFormulas().belongsToRoleReadWrite) {
                        ret =
                            ret &&
                            this.getFormulas().belongsToRoleReadWrite.call(
                                this,
                                this.getFormulaFn
                            );
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
            },

            isPadlockVisible: {
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
