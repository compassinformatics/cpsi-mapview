var store = Ext.create('Ext.data.Store', {
    model: 'CpsiMapview.model.LinearReference',
    data: [
        { startMeasure: 0, endMeasure: 200, text: 'asdsad'},
        { startMeasure: 200, endMeasure: 1000, text: 'asdasd'},
        { startMeasure: 1100, endMeasure: 1300, text: 'jydygj' },
        { startMeasure: 1300, endMeasure: 2000, text: 'adas'},
        { startMeasure: 2000, endMeasure: 12000, text: 'adas'}
    ]
});

function meterRenderer(val) {
    return val.toFixed(1) + ' m';
}

Ext.define('CpsiMapview.view.linearReference.LinearReference', {
    extend: 'Ext.grid.Panel',
    xtype: 'cmv_linear_reference',
    store: store,
    plugins: [{
        ptype: 'cmv_line_slice_highlight'
    }],
    columns: [
        {
            text: 'From',
            dataIndex: 'startMeasure',
            renderer: meterRenderer
        },
        {
            text: 'To',
            dataIndex: 'endMeasure',
            renderer: meterRenderer
        },
        {
            text: 'Text',
            dataIndex: 'text'
        }
    ],
    initComponent: function () {
        var map = BasiGX.util.Map.getMapComponent().map;

        var format = new ol.format.GeoJSON({
            featureProjection: 'EPSG:3857'
        });

        this.feature = format.readFeature('{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-965068.9613156476,6917903.9768694835],[-963761.0112796988,6918876.101896202],[-962187.936236463,6919883.576923893],[-960915.3362014858,6920608.25194381],[-959695.7611679661,6920024.976927779],[-958264.0861286167,6919176.576904461],[-957645.4611116138,6918893.776896688],[-961533.9612184886,6918116.076875313],[-964344.28629573,6914528.051776697],[-965387.1113243919,6915853.676813131]]},"properties":null}', {
            dataProjection: 'EPSG:3857'
        });

        new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [this.feature]
            }),
            map: map,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'yellow',
                    width: 2
                })
            })
        });

        this.callParent(arguments);

        var highlighter = this.getPlugin('cmv_line_slice_highlight');
        highlighter.setStyle(new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'blue',
                width: 2
            })
        }));
    },
    listeners: {
        itemclick: function (_, record) {
            var start = record.data.startMeasure;
            var end = record.data.endMeasure;
            var highlighter = this.getPlugin('cmv_line_slice_highlight');

            highlighter.highlightSlice(this.feature.getGeometry(), start, end);
        }
    }
});
