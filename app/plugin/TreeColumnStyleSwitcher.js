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

    /**
     * List of currently rendered instances of
     * CpsiMapview.view.layer.StyleSwitcherRadioGroup. Used to cleanup.
     *
     * @property {CpsiMapview.view.layer.StyleSwitcherRadioGroup[]}
     * @readonly
     * @private
     */
    radioGroups: [],

    /**
     * @private
     */
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
            // DIV placeholder for radio group (layer record ID as connector)
            '<div id="{[this.getRecId(values.record)]}" style="">',
            '</div>',
            '</tpl>'
        ];

        // helper function to get a DOM ID from layer record ID in XTemplate
        var getRecId = function (rec) {
            return THIS_CLS.getDomId(rec.getId());
        };
        // helper function if a DIV placeholder for style switcher is needed
        var needsStyleSwitcher = function (rec) {
            var olLayer = rec.getOlLayer();
            return !rec.get('isLayerGroup') && olLayer &&
                Ext.isArray(olLayer.get('styles'));
        };

        if (treeColumn.cellTpl.length === 2) {

            // The cellTpl of this column is modeled as a single string
            // (as done in plugin.cmv_basic_tree_column_legend).
            // So the cellTpl is an array with 2 entries (0 => XTemplate string,
            // 1 => context object with template functions)

            // inject template code (string) to existing one
            var origCellTpl = treeColumn.cellTpl[0];
            treeColumn.cellTpl[0] = origCellTpl.replace(
                '</span></tpl>', '</span>' + tplArr.join('') + '</tpl>');
            // set context function for XTemplate
            treeColumn.cellTpl[1].getRecId = getRecId;
            treeColumn.cellTpl[1].needsStyleSwitcher = needsStyleSwitcher;
        } else {

            // The case that the XTemplate is modeled as array (default)
            // 0-(n-1) => XTemplate strings, n => context object with template
            // functions

            // inject template code (array) to existing one
            Ext.Array.insert(treeColumn.cellTpl, treeColumn.cellTpl.length-1, tplArr);
            // set context function for XTemplate
            treeColumn.cellTpl.push({
                getRecId: getRecId,
                needsStyleSwitcher: needsStyleSwitcher
            });
        }

        me.callParent();

        // wait until all layers are loaded to the map
        var layerTree = treeColumn.up('treepanel');
        layerTree.on('cmv-init-layertree', function () {
            // render radio groups on initialisation
            me.cleanupAllRadioGroups();
            me.renderRadioGroups();

            // ensure the radio groups are re-rendered every time the tree view
            // changes (e.g.) layer visibility is changed
            layerTree.getView().on('refresh', function () {
                Ext.defer(function () {
                    me.cleanupAllRadioGroups();
                    me.renderRadioGroups();
                }, 1);
            });
        });

        // ensure that the radio groups are rendered after a node has been
        // dragged and dropped
        treeColumn.up('treepanel').on('drop', function (node, data) {
            Ext.defer(function () {
                me.cleanupAllRadioGroups();
                // updates the whole node for the layer and forces the
                // me.renderRadioGroups via 'itemupdate' event
                // directly executing me.renderRadioGroups leaves some artifacts
                if (data.records && data.records.length > 0 && data.records[0].getOlLayer()) {
                    var layer = data.records[0].getOlLayer();
                    treeColumn.up('treepanel').updateLayerNodeUi(layer);
                }
            }, 1);
        });
    },

    /**
     * Renders the radio groups for each layer having connected styles.
     * The radio group instance is injected into the DIV placeholder created in
     * the cellTpl of this tree column (see #init fucntion of this plugin).
     * Connection of placeholder and layer is done by the layer record ID.
     */
    renderRadioGroups: function () {
        var me = this;
        var THIS_CLS = CpsiMapview.plugin.TreeColumnStyleSwitcher;
        var treePanel = me.cmp.up('treepanel');

        treePanel.getRootNode().cascadeBy(function (node) {
            // skip group layers (folders) and the root node
            if (!node.get('isLayerGroup') && node.get('text') !== 'root') {
                var lyrRecId = node.get('id');
                var placeholderDomId = THIS_CLS.getDomId(lyrRecId);
                // use fly to avoid Ext element cache which raises error
                var placeholderDiv = Ext.fly(placeholderDomId);
                var olLayer = node.getOlLayer();

                if (placeholderDiv && olLayer.get('styles')) {

                    var radioGroup = Ext.create('CpsiMapview.view.layer.StyleSwitcherRadioGroup', {
                        layer: olLayer,
                        containerId: placeholderDiv.id,
                        renderTo: placeholderDiv
                    });

                    me.radioGroups.push(radioGroup);
                }
            }
        });
    },

    /**
     * Removes all currently rendered radio groups.
     */
    cleanupAllRadioGroups: function () {
        var me = this;

        Ext.each(me.radioGroups, function (rg) {
            rg.destroy();
        });

        me.radioGroups = [];
    }
});
