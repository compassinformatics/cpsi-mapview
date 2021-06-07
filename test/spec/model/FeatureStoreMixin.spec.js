Ext.define('CpsiMapview.model.Example', {
    extend: 'Ext.data.Model',

    mixins: {
        features: 'CpsiMapview.model.FeatureStoreMixin'
    },

    requires: [
        'CpsiMapview.field.Polygon',
        'CpsiMapview.field.Line'
    ],

    fields: [
        {
            name: 'id',
            type: 'int',
            defaultValue: null,
            persist: false
        },
        {
            name: 'features1',
            type: 'polygon'
        },
        {
            name: 'features2',
            type: 'line'
        }
    ]
});

describe('CpsiMapview.model.FeatureStoreMixin', function() {
    var model;
    var store;
    var source;

    beforeEach(function () {
        model = Ext.create('CpsiMapview.model.Example', {
            id: 25,
            features1: '{ "type": "Polygon", "coordinates": ' +
              '[[[0,0], [0,1], [1,1], [1,0], [0,0]]] }',
            features2: '{ "type": "FeatureCollection", "features": [' +
              '{ "type": "Feature", "properties": null, "geometry":' +
              '{ "type": "LineString", "coordinates": [[1,1], [1,2]] }},' +
              '{ "type": "Feature", "properties": null, "geometry":' +
              '{ "type": "LineString", "coordinates": [[1,2], [2,2]] }},' +
              '{ "type": "Feature", "properties": null, "geometry":' +
              '{ "type": "LineString", "coordinates": [[2,2], [2,1]] }},' +
              '{ "type": "Feature", "properties": null, "geometry":' +
              '{ "type": "LineString", "coordinates": [[2,1], [1,1]] }} ]}'
        });
        store = model.featureStores['features2'];
        source = store.layer.getSource();
    });

    it('should calculate the correct bounds', function () {
        var bounds = model.getRecordBounds();
        expect(bounds).to.eql([0, 0, 2, 2]);
    });

    it('initializes layer and store correctly', function () {
        expect(store.getCount()).to.be(4);
        expect(source.getFeatures().length).to.be(4);
    });

    it('synchronizes store if layer is changed', function () {
        var feature = source.getFeatures()[0];
        source.removeFeature(feature);
        expect(store.getCount()).to.be(3);
        source.addFeature(feature);
        expect(store.getCount()).to.be(4);
    });

    it('synchronizes layer if store is changed', function () {
        var record = store.getAt(0);
        store.remove(record);
        expect(source.getFeatures().length).to.be(3);
        store.add(record);
        expect(source.getFeatures().length).to.be(4);
    });
});
