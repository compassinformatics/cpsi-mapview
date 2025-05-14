Ext.define('CpsiMapview.model.PolygonFeatureExample', {
    extend: 'Ext.data.Model',
    mixins: {
        features: 'CpsiMapview.model.FeatureStoreMixin'
    },
    requires: ['CpsiMapview.field.Polygon'],
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'polygonField',
            type: 'polygon',
            featureStoreConfig: {
                lineColor: 'green',
                pointColor: 'yellow',
                selectLineColor: 'purple',
                selectPointColor: 'black'
            }
        }
    ]
});

describe('CpsiMapview.field.Polygon', function () {
    let model;
    let fld;
    let store;
    let source;

    beforeEach(function () {
        const data =
            '{ "type": "Feature", "properties": null, "geometry":' +
            '{ "type": "Polygon", "coordinates": [[[0,0], [0,1], [1,1], [1,0], [0,0]]] }}';

        model = Ext.create('CpsiMapview.model.PolygonFeatureExample', {
            id: 25,
            polygonField: data
        });

        fld = model.getField('polygonField');
        store = model.featureStores['polygonField'];
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
        const gj = fld.getPolygonGeometry(store.layer);
        expect(gj).to.eql({
            type: 'Polygon',
            coordinates: [
                [
                    [0, 0],
                    [0, 1],
                    [1, 1],
                    [1, 0],
                    [0, 0]
                ]
            ]
        });
    });

    it('can serialize', function () {
        const gj = fld.serialize(null, model);
        expect(gj).to.eql({
            type: 'Polygon',
            coordinates: [
                [
                    [0, 0],
                    [0, 1],
                    [1, 1],
                    [1, 0],
                    [0, 0]
                ]
            ]
        });
    });

    it('can serialize circle', function () {
        // replace the polygon geometry with a circle geometry
        const circle = new ol.geom.Circle([0, 0], 1);
        const feat = source.getFeatures()[0];
        feat.setGeometry(circle);

        const gj = fld.serialize(null, model);
        expect(gj.coordinates[0].length).to.be(33); // ol makes an approximation of a circle using lots of coordinates
    });

    it('can create style', function () {
        const style = fld.createStyle();
        expect(style.getStroke().getColor()).to.be('#3399CC');
        expect(style.getImage().getFill().getColor()).to.be(
            'rgba(255,255,255,0.4)'
        );
    });

    it('can create select style', function () {
        const style = fld.createSelectStyle();
        expect(style).to.be(null);
    });
});
