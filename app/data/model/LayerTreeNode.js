/**
 * The CPSI MapView layer tree node class used by the stores used in trees.
 *
 * @class CpsiMapview.data.model.LayerTreeNode
 */
Ext.define('CpsiMapview.data.model.LayerTreeNode', {
    extend: 'GeoExt.data.model.LayerTreeNode',

    /**
     * The layer property that will be used to hold a title for the description of the model in views.
     *
     * @cfg {String}
     */
    descriptionTitleProperty: 'descTitle',

    fields: [
        {
            name: 'qtitle',
            type: 'string',
            persist: false,
            convert: function(v, record) {
                return record.getOlLayerProp(record.descriptionTitleProperty, '') || record.get('text');
            }
        },
        {
            name: '__toggleMode',
            type: 'string',
            defaultValue: 'ol3'
        }
    ],

    /**
     * Only toggle checkboxes if the layer is in the layer tree
     * This avoids a costly refresh of the entire tree
     * @param {any} evt
     */
    onLayerVisibleChange: function (evt) {
        var layer = evt.target;

        if (layer.get('displayInLayerSwitcher') !== false) {
            if (!this.__updating) {
                this.set('checked', layer.get('visible'));
            }
        }
    }
});
