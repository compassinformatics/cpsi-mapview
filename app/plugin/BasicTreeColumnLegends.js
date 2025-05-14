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
        hasLegend: function (rec) {
            const isChecked = rec.get('checked');
            const layer = rec.data;
            return isChecked && !(layer instanceof ol.layer.Group);
        },
        getLegendHtml: function (rec) {
            const staticMe = CpsiMapview.plugin.BasicTreeColumnLegends;
            const layer = rec.data;
            let layerKey = layer.get('layerKey');

            // a layer can have different legends for different styles
            // ensure each of these are cached
            if (layer.getSource && layer.getSource().getParams) {
                const styles = layer.getSource().getParams().STYLES;
                if (styles) {
                    layerKey += '_' + styles.toUpperCase();
                }
            } else {
                // for WFS we also use the WMS legend so make sure we create a cache
                // key for these or it will always use just the layerKey
                const activatedStyle = layer.get('activatedStyle');
                if (activatedStyle) {
                    layerKey += '_' + activatedStyle.toUpperCase();
                }
            }

            let legendUrl = layer.get('legendUrl');
            let w = layer.get('legendWidth');
            let h = layer.get('legendHeight');

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

            const legendDataUrl =
                CpsiMapview.view.LayerTree.legendImgLookup[layerKey];
            if (!legendDataUrl) {
                // load the legend image and cache it in an static lookup for later re-use
                // without any server request

                // check if there is an ongoing loading for the legend of this layer
                // since getLegendHtml is executed several times for one refresh due to
                // unknown reasons
                // Flag set / reset in LegendUtil.getLegendImgHtmlTpl
                const isLoading = LegendUtil['legendLoading_' + layerKey];
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
        transparentGif:
            'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP' +
            '///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        checkCleanup: function (img) {
            const staticMe = CpsiMapview.plugin.BasicTreeColumnLegends;
            const el = Ext.get(img);
            const w = parseInt(el.getAttribute('width'), 10);
            const h = parseInt(el.getAttribute('height'), 10);
            const src = el.getAttribute('src');
            if (w === 1 && h === 1 && src === staticMe.transparentGif) {
                const parent = Ext.get(img.parentNode);
                const removeElems = parent.query('br, img');
                Ext.each(removeElems, function (removeElem) {
                    Ext.get(removeElem).destroy();
                });
            }
        }
    },

    init: function (column) {
        const me = this;
        if (!(column instanceof Ext.grid.column.Column)) {
            Ext.log.warn(
                'Plugin shall only be applied to instances of' +
                    ' Ext.grid.column.Column'
            );
            return;
        }
        const valuePlaceHolderRegExp = /\{value\}/g;
        const replacementTpl = me.valueReplacementTpl.join('');
        const newCellTpl = me.originalCellTpl.replace(
            valuePlaceHolderRegExp,
            replacementTpl
        );

        column.cellTpl = [newCellTpl, me.valueReplacementContext];
    }
});
