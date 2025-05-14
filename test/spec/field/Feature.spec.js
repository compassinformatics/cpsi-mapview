Ext.define('CpsiMapview.model.FeatureExample', {
    extend: 'Ext.data.Model',
    mixins: {
        features: 'CpsiMapview.model.FeatureStoreMixin'
    },
    requires: ['CpsiMapview.field.Feature'],
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'featureField',
            type: 'feature'
        }
    ]
});

describe('CpsiMapview.field.Feature', function () {
    it('is defined', function () {
        const fld = Ext.create('CpsiMapview.field.Feature');
        expect(fld).not.to.be(undefined);
    });

    it('can convert data', function () {
        const model = Ext.create('CpsiMapview.model.FeatureExample', {
            id: 25,
            features: null
        });

        const fld = model.getField('featureField');

        const data =
            '{ "type": "Polygon", "coordinates": ' +
            '[[[0,0], [0,1], [1,1], [1,0], [0,0]]] }';

        fld.convert(data, model);

        // the conversion should not cause the model to become dirty
        expect(model.dirty).to.be(false);

        const store = model.featureStores['featureField'];
        const source = store.layer.getSource();

        expect(store.getCount()).to.be(1);
        expect(source.getFeatures().length).to.be(1);
    });
});
