/**
 * This view is an example list of people.
 */
Ext.define('CpsiMapview.view.main.Map', {
    extend: 'Ext.panel.Panel',
    xtype: 'mainlist',

    requires: [
        'GeoExt.component.Map'
    ],

    layout: 'fit',

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            text: 'Docked to the top'
        }]
    }, {
        xtype: 'toolbar',
        dock: 'bottom',
        items: [{
          text: 'Docked to the bottom'
        }]
    }],

    items: [{
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
    }]
});
