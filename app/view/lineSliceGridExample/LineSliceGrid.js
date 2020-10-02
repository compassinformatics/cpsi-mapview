var store = Ext.create('Ext.data.Store', {
    data: [
        {startMeasure: 0, endMeasure: 200, text: 'slice 1'},
        {startMeasure: 200, endMeasure: 1000, text: 'slice 2'},
        {startMeasure: 1100, endMeasure: 1800, text: 'slice 3'},
        {startMeasure: 1400, endMeasure: 4000, text: 'slice 4'},
        {startMeasure: 5000, endMeasure: 12000, text: 'slice 5'}
    ]
});

function meterRenderer(val) {
    return val.toFixed(1) + ' m';
}

Ext.define('CpsiMapview.view.lineSliceGridExample.LineSliceGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'cmv_line_slice_grid',

    requires: [
        'CpsiMapview.plugin.LineSliceHighlight'
    ],

    plugins: [{
        ptype: 'cmv_line_slice_highlight'
    }],

    store: store,

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
    listeners: {
        itemclick: function (_, record) {
            var highlighter = this.getPlugin('cmv_line_slice_highlight');
            highlighter.highlightSlice(this.feature.getGeometry(), record.data.startMeasure, record.data.endMeasure);
        }
    },

    initComponent: function () {
        var map = BasiGX.util.Map.getMapComponent().map;

        var geoJson = JSON.stringify({
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': [
                    [-965068.9613156476, 6917903.9768694835], [-963761.0112796988, 6918876.101896202],
                    [-962187.936236463, 6919883.576923893], [-960915.3362014858, 6920608.25194381],
                    [-959695.7611679661, 6920024.976927779], [-958264.0861286167, 6919176.576904461],
                    [-957645.4611116138, 6918893.776896688], [-961533.9612184886, 6918116.076875313],
                    [-964344.28629573, 6914528.051776697], [-965387.1113243919, 6915853.676813131]
                ]
            },
            'properties': null
        });

        this.feature = (new ol.format.GeoJSON()).readFeature(geoJson, {
            featureProjection: 'EPSG:3857',
            dataProjection: 'EPSG:3857'
        });

        var layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [this.feature]
            }),
            map: map,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'yellow',
                    width: 2
                })
            }),
            visible: false
        });

        this.callParent(arguments);

        var highlighter = this.getPlugin('cmv_line_slice_highlight');

        highlighter.setStyle(new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'blue',
                width: 2
            })
        }));

        this.up('cmv_minimizable_window').on('show', function () {
            layer.setVisible(true);
            map.render();
        });

        this.up('cmv_minimizable_window').on('close', function () {
            layer.setVisible(false);
            highlighter.removeHighlight();
            map.render();
        });
    }
});


