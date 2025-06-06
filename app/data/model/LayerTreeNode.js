/**
 * The CPSI MapView layer tree node class used by the stores used in trees.
 *
 * @class CpsiMapview.data.model.LayerTreeNode
 */
Ext.define('CpsiMapview.data.model.LayerTreeNode', {
    extend: 'GeoExt.data.model.LayerTreeNode',

    requires: ['CpsiMapview.util.Style'],

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
            convert: function (v, record) {
                return (
                    record.getOlLayerProp(
                        record.descriptionTitleProperty,
                        ''
                    ) || record.get('text')
                );
            }
        },
        {
            name: '__toggleMode',
            type: 'string',
            defaultValue: 'ol3'
        },
        {
            // overwrite the text property to add custom behavior
            name: 'text',
            type: 'string',
            persist: false,
            convert: function (v, record) {
                if (!v) {
                    // folders / LayerGroups
                    const layerGroup = record.getOlLayer();
                    if (layerGroup) {
                        return record.getOlLayer().get('name');
                    }
                }

                // add layer style to node text if we have the style chooser
                // in the context menu and not as direct item under the node
                const layerTree = Ext.ComponentQuery.query('cmv_layertree')[0];
                if (layerTree && layerTree.styleSwitcherBelowNode === false) {
                    const olLayer = record.getOlLayer();
                    if (olLayer && olLayer.get('activatedStyle')) {
                        // get activated layer style
                        const activatedStyle = olLayer.get('activatedStyle');
                        const styleTitle =
                            CpsiMapview.util.Style.getLayerStyleTitle(
                                activatedStyle,
                                olLayer
                            );

                        // apply node name + style name
                        const treeNodeConf = olLayer.get('_origTreeConf');
                        if (treeNodeConf && treeNodeConf.text && styleTitle) {
                            return treeNodeConf.text + ' (' + styleTitle + ')';
                        }
                    }
                }

                return v;
            }
        }
    ],

    /**
     * Only toggle checkboxes if the layer is in the layer tree
     * This avoids a costly refresh of the entire tree
     * @param {any} evt
     */
    onLayerVisibleChange: function (evt) {
        const layer = evt.target;

        if (!this.__updating) {
            this.set('checked', layer.get('visible'));
        }
    }
});
