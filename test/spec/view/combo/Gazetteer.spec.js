describe('CpsiMapview.view.combo.Gazetteer', function () {

    Ext.define('TestGazetteerModel', {
        extend: 'Ext.data.Model',

        fields: [
            { name: 'minX3857', type: 'float' },
            { name: 'minY3857', type: 'float' },
            { name: 'maxX3857', type: 'float' },
            { name: 'maxY3857', type: 'float' }
        ],

        // Other configurations for your model can go here
    });

    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.view.combo.Gazetteer).not.to.be(undefined);
        });

        it('can be instantiated', function () {
            var inst = Ext.create('CpsiMapview.view.combo.Gazetteer', {});
            expect(inst).to.be.a(CpsiMapview.view.combo.Gazetteer);
        });

        it('can get an extent record', function () {
            var inst = Ext.create('CpsiMapview.view.combo.Gazetteer', {});

            var rec = Ext.create('TestGazetteerModel', {
                minX3857: 0,
                minY3857: 0,
                maxX3857: 100,
                maxY3857: 100,
            });

            var extent = inst.convertToExtent(null, rec);
            expect(extent.toString()).to.equal([0, 0, 100, 100].toString());
        });

        it('can get an extent record with alternate field names', function () {
            var inst = Ext.create('CpsiMapview.view.combo.Gazetteer', { fieldNameSuffix: '2157' });

            var rec = Ext.create('TestGazetteerModel', {
                minX2157: 0,
                minY2157: 0,
                maxX2157: 100,
                maxY2157: 100,
            });

            var extent = inst.convertToExtent(null, rec);
            expect(extent.toString()).to.equal([0, 0, 100, 100].toString());
        });
    });
});
