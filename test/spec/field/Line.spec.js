Ext.define('CpsiMapview.model.LineFeatureExample', {
    extend: 'Ext.data.Model',
    mixins: {
        features: 'CpsiMapview.model.FeatureStoreMixin'
    },
    requires: ['CpsiMapview.field.Line'],
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'lineField',
            type: 'line',
            featureStoreConfig: {
                lineColor: 'green',
                pointColor: 'yellow',
                selectLineColor: 'purple',
                selectPointColor: 'black'
            }
        }
    ]
});

describe('CpsiMapview.field.Line', function () {
    let model;
    let fld;
    let store;
    let source;

    beforeEach(function () {
        const data =
            '{ "type": "FeatureCollection", "features": [' +
            '{ "type": "Feature", "properties": null, "geometry":' +
            '{ "type": "Point", "coordinates": [1, 1] }},' +
            '{ "type": "Feature", "properties": null, "geometry":' +
            '{ "type": "LineString", "coordinates": [[1,1], [1,2]] }},' +
            '{ "type": "Feature", "properties": null, "geometry":' +
            '{ "type": "LineString", "coordinates": [[1,2], [2,2]] }},' +
            '{ "type": "Feature", "properties": null, "geometry":' +
            '{ "type": "LineString", "coordinates": [[2,2], [2,1]] }},' +
            '{ "type": "Feature", "properties": null, "geometry":' +
            '{ "type": "MultiLineString", "coordinates": [[[2,1], [1,1]]] }} ]}';

        model = Ext.create('CpsiMapview.model.LineFeatureExample', {
            id: 25,
            lineField: data
        });

        fld = model.getField('lineField');
        store = model.featureStores['lineField'];
        source = store.layer.getSource();
    });

    it('is defined', function () {
        expect(fld).not.to.be(undefined);
    });

    it('features are loaded', function () {
        expect(model.dirty).to.be(false);
        expect(store.getCount()).to.be(4); // the point geometry will be filtered from the grid
        expect(source.getFeatures().length).to.be(5); // but not the layer
    });

    it('can get attributes', function () {
        const recs = fld.getFeatureAttributes(store);
        expect(recs.length).to.be(4);
        //console.log(recs[0]);
    });

    it('can serialize', function () {
        const recs = fld.serialize(null, model);
        expect(recs.length).to.be(4);
    });

    it('can create point and line style', function () {
        const style = fld.createPointLineStyle('blue', 'green');
        expect(style.getImage().getStroke().getColor()).to.be('blue');
        expect(style.getStroke().getColor()).to.be('blue');
        expect(style.getImage().getFill().getColor()).to.be('green');
    });

    it('can create style', function () {
        const style = fld.createStyle();
        expect(style.getImage().getStroke().getColor()).to.be('green');
        expect(style.getStroke().getColor()).to.be('green');
        expect(style.getImage().getFill().getColor()).to.be('yellow');
    });

    it('can create select style', function () {
        const style = fld.createSelectStyle();
        expect(style.getImage().getStroke().getColor()).to.be('purple');
        expect(style.getStroke().getColor()).to.be('purple');
        expect(style.getImage().getFill().getColor()).to.be('black');
    });
});
