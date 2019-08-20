/**
 * A plugin for Ext.grid.column.Column that extends the internal cellTpl to
 * add a radio group to switch the style for a layer
 * (CpsiMapview.view.layer.StyleSwitcherRadioGroup).
 */
Ext.define('CpsiMapview.plugin.TreeColumnStyleSwitcher', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.cmv_tree_column_style_switcher',
    pluginId: 'cmv_tree_column_style_switcher',

    requires: ['CpsiMapview.view.layer.StyleSwitcherRadioGroup'],

    statics: {
        /**
         * Returns a valid HTML element ID from the given UUID (e.g. the ID of
         * a layer record).
         *
         * @param  {String} uuid The UUID to transform to a HTML ID
         * @return {String}      The HTML ID derived from the UUID
         */
        getDomId: function (uuid) {
            return 'cmv-tss-' + uuid;
        }
    },

    init: function(treeColumn) {
        var me = this;
        if (!(treeColumn instanceof Ext.grid.column.Column)) {
            Ext.log.warn('Plugin shall only be applied to instances of' +
                    ' Ext.grid.column.Column');
            return;
        }
        var THIS_CLS = CpsiMapview.plugin.TreeColumnStyleSwitcher;

        // add a DIV as placeholder for each layer needing a style switcher
        var tplArr = [
            '<tpl if="this.needsStyleSwitcher(values.record)">',
            '<div id="{[this.getRecId(values.record)]}" style="">',
            '</div>',
            '</tpl>'
        ];

        // Currently this plugin only works if the cellTpl of this column is
        // modeled as a single string (as done in plugin.cmv_basic_tree_column_legend).
        // So the cellTpl is an array with 2 entries (0 => XTemplate string,
        // 1 => context object with template functions)
        // For the case that the XTemplate is modeled as array this is
        // currently not working.
        //TODO handle cellTpl as array

        // inject template code to existing one
        var origCellTpl = treeColumn.cellTpl[0];
        treeColumn.cellTpl[0] = origCellTpl.replace('</span></tpl>', tplArr.join('') + '</span></tpl>');

        // helper function to get a DOM ID from layer record ID in XTemplate
        treeColumn.cellTpl[1].getRecId = function(rec) {
            return THIS_CLS.getDomId(rec.getId());
        };
        // helper function if a DIV placeholder for style switcher is needed
        treeColumn.cellTpl[1].needsStyleSwitcher = function(rec) {
            var olLayer = rec.getOlLayer();
            return !rec.get('isLayerGroup') && olLayer &&
                Ext.isArray(olLayer.get('styles'));
        };

        me.callParent();

        // wait until all layers are loaded to the map
        var mapCmp = CpsiMapview.view.main.Map.guess();
        mapCmp.on('cmv-init-layersadded', function () {
            // Unfortunately we have to defer cascading of the LayerTree nodes.
            // Otherwise they are not ready and we do not have a fitting event.
            Ext.defer(function () {

                var treePanel = treeColumn.up('treepanel');
                treePanel.getRootNode().cascadeBy(function (node) {
                    // skip group layers (folders) and the root node
                    if (!node.get('isLayerGroup') && node.get('text') !== 'root') {
                        var lyrRecId = node.get('id');
                        var placeholderDomId = THIS_CLS.getDomId(lyrRecId);
                        var placeholderDiv =
                            Ext.DomQuery.select('#' + placeholderDomId)[0];
                        var olLayer = node.getOlLayer();

                        if (placeholderDiv && olLayer.get('styles')) {

                            Ext.create('CpsiMapview.view.layer.StyleSwitcherRadioGroup', {
                                layer: olLayer,
                                renderTo: placeholderDiv
                            });
                        }
                    }
                });

            }, 100);
        });
    }
});
