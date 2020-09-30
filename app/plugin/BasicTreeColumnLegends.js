/**
 * A plugin for Ext.grid.column.Column that overwrites the internal cellTpl to
 * support legends.
 */
Ext.define('CpsiMapview.plugin.BasicTreeColumnLegends', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.cmv_basic_tree_column_legend',
    pluginId: 'cmv_basic_tree_column_legend',

    requires: ['CpsiMapview.util.Legend'],

    /**
     * @private
     */
    originalCellTpl: Ext.clone(Ext.tree.Column.prototype.cellTpl).join(''),

    /**
     * The Xtemplate strings that will be used instead of the plain {value}
     * when rendering
     * We add a additional div in order to expand and collapse the legends. The syntax in templates is picky here...
     */
    valueReplacementTpl: [
        '{value}',
        '<tpl if="this.hasLegend(values.record)"><br />',
        '<tpl for="lines">',
        '<img src="{parent.blankUrl}"',
        ' class="{parent.childCls} {parent.elbowCls}-img ',
        '{parent.elbowCls}-<tpl if=".">line<tpl else>empty</tpl>"',
        ' role="presentation"/>',
        '</tpl>',
        '<img src="{blankUrl}" class="{childCls} x-tree-elbow-img">',
        '<img src="{blankUrl}" class="{childCls} x-tree-elbow-img">',
        '<img src="{blankUrl}" class="{childCls} x-tree-elbow-img">',
        '{[this.getLegendHtml(values.record)]}',
        '</tpl>'
    ],

    /**
     * The context for methods available in the template
     */
    valueReplacementContext: {
        hasLegend: function(rec) {
            var isChecked = rec.get('checked');
            var layer = rec.data;
            return isChecked && !(layer instanceof ol.layer.Group);
        },
        getLegendHtml: function(rec) {
            var staticMe = CpsiMapview.plugin.BasicTreeColumnLegends;
            var layer = rec.data;
            var layerKey = layer.get('layerKey');
            var legendUrl = layer.get('legendUrl');
            var w = layer.get('legendWidth');
            var h = layer.get('legendHeight');

            if (!legendUrl) {
                legendUrl = LegendUtil.createGetLegendGraphicUrl(layer);
            }
            // if the legend cannot be obtained (which happens e.g. for cascaded
            // WMS layers, as geoserver does not support legends for these
            // layers) we remove the broken image and the other dom elements
            // that otherwise would lead to vertical gap between layers in the
            // tree.
            if (!legendUrl) {
                // 1px×1px transparent gif
                legendUrl = staticMe.transparentGif;
                w = h = 1;
            }

            var legendDataUrl = CpsiMapview.view.LayerTree.legendImgLookup[layerKey];
            if (!legendDataUrl) {
                // load the legend image and cache it in an static lookup for later re-use
                // without any server request

                // check if there is an ongoing loading for the legend of this layer
                // since getLegendHtml is executed several times for one refresh due to
                // unkwon reasons
                // Flag set / reset in LegendUtil.getLegendImgHtmlTpl
                var isLoading = LegendUtil['legendLoading_' + layerKey];
                if (isLoading) {
                    // skip loading
                    return LegendUtil.getLegendImgHtmlTpl(legendUrl, w, h);
                }

                LegendUtil.cacheLegendImgAsDataUrl(legendUrl, layerKey);

            } else {
                legendUrl = legendDataUrl;
            }

            return LegendUtil.getLegendImgHtmlTpl(legendUrl, w, h);
        }
    },

    statics: {
        transparentGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP' +
            '///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        checkCleanup: function(img) {
            var staticMe = CpsiMapview.plugin.BasicTreeColumnLegends;
            var el = Ext.get(img);
            var w = parseInt(el.getAttribute('width'), 10);
            var h = parseInt(el.getAttribute('height'), 10);
            var src = el.getAttribute('src');
            if(w === 1 && h === 1 && src === staticMe.transparentGif) {
                var parent = Ext.get(img.parentNode);
                var removeElems = parent.query('br, img');
                Ext.each(removeElems, function(removeElem) {
                    Ext.get(removeElem).destroy();
                });
            }
        }
    },

    init: function(column) {
        var me = this;
        if (!(column instanceof Ext.grid.column.Column)) {
            Ext.log.warn('Plugin shall only be applied to instances of' +
                    ' Ext.grid.column.Column');
            return;
        }
        var valuePlaceHolderRegExp = /\{value\}/g;
        var replacementTpl = me.valueReplacementTpl.join('');
        var newCellTpl = me.originalCellTpl.replace(
            valuePlaceHolderRegExp, replacementTpl
        );

        column.cellTpl = [
            newCellTpl,
            me.valueReplacementContext
        ];
    }
});
