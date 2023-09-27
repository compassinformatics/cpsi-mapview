Ext.Loader.syncRequire([
    'CpsiMapview.util.Legend'
]);

describe('CpsiMapview.util.Legend', function () {
    var cmp = CpsiMapview.util.Legend;

    describe('Basics', function () {
        it('is defined', function () {
            expect(cmp).not.to.be(undefined);
        });
    });

    describe('#getUniqueLayersParam', function () {
        it('removes duplicate layers from list', function () {
            var layers = ['foo', 'foo'];
            var uniqueLayers = cmp.getUniqueLayersParam(layers);
            expect(uniqueLayers).to.equal('foo');
        });

        it('removes duplicate layers from a string', function () {
            var layers = 'foo,foo';
            var uniqueLayers = cmp.getUniqueLayersParam(layers);
            expect(uniqueLayers).to.equal('foo');
        });
    });
});
