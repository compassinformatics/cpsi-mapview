Ext.define('CpsiMapview.model.PointFeatureExample', {
    extend: 'Ext.data.Model',
    mixins: {
        features: 'CpsiMapview.model.FeatureStoreMixin'
    },
    requires: [
        'CpsiMapview.field.Point'
    ],
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'pointField',
            type: 'point',
            featureStoreConfig: {
                lineColor: 'green',
                pointColor: 'yellow',
                selectLineColor: 'purple',
                selectPointColor: 'black'
            }
        }
    ]
});

describe('CpsiMapview.field.Point', function () {

    var model;
    var fld;
    var store;
    var source;

    beforeEach(function () {

        var data = '{ "type": "Feature", "properties": null, "geometry":' +
            '{ "type": "Point", "coordinates": [1, 1] }}';

        model = Ext.create('CpsiMapview.model.PointFeatureExample', {
            id: 25,
            pointField: data
        });

        fld = model.getField('pointField');
        store = model.featureStores['pointField'];
        source = store.layer.getSource();
    });

    it('is defined', function () {
        expect(fld).not.to.be(undefined);
    });

    it('features are loaded', function () {
        expect(store.getCount()).to.be(1);
        expect(source.getFeatures().length).to.be(1);
    });

    it('can get geometry', function () {
        var gj = fld.getPointGeometry(store.layer);
        expect(gj).to.eql({ type: 'Point', coordinates: [1, 1] });
    });

    it('can serialize', function () {
        var gj = fld.serialize(null, model);
        expect(gj).to.eql({ type: 'Point', coordinates: [1, 1] });
    });

    it('can create style', function () {
        var style = fld.createStyle();
        expect(style.getStroke().getColor()).to.be('Maroon');
        expect(style.getImage().getFill().getColor()).to.be('DarkOrange');
    });

    it('can create select style', function () {
        var style = fld.createSelectStyle();
        expect(style).to.be(null);
    });

});
