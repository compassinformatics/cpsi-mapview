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
        }
    ]

});
