/**
 * This view is an example list of people.
 */
Ext.define('CpsiMapview.view.main.List', {
    extend: 'Ext.panel.Panel',
    xtype: 'mainlist',

    requires: [
        'GeoExt.component.Map'
    ],

    title: 'A Map',

    height: 200, // will be gone soon

    items: {
        xtype: 'gx_map',
        map: new ol.Map({
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.Stamen({
                        layer: 'watercolor'
                    })
                }),
                new ol.layer.Tile({
                    source: new ol.source.Stamen({
                        layer: 'terrain-labels'
                    })
                })
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat( [-8.751278, 40.611368] ),
                zoom: 12
            })
        })
    }
});
