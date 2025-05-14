Ext.Loader.syncRequire(['CpsiMapview.util.Legend']);

describe('CpsiMapview.util.Legend', function () {
    const cmp = CpsiMapview.util.Legend;

    describe('Basics', function () {
        it('is defined', function () {
            expect(cmp).not.to.be(undefined);
        });
    });

    describe('#getUniqueLayersParam', function () {
        it('removes duplicate layers from list', function () {
            const layers = ['foo', 'foo'];
            const uniqueLayers = cmp.getUniqueLayersParam(layers);
            expect(uniqueLayers).to.equal('foo');
        });

        it('removes duplicate layers from a string', function () {
            const layers = 'foo,foo';
            const uniqueLayers = cmp.getUniqueLayersParam(layers);
            expect(uniqueLayers).to.equal('foo');
        });
    });
});
