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

    describe('#getWmsStyleFromSldFile', function () {
        it('derives a style from file name', function () {
            var fileName = 'LAYERS_STYLES.xml';
            var styleName = cmp.getWmsStyleFromSldFile(fileName);
            expect(styleName).to.equal('STYLES');
        });

        it('replaces underscores in style name with spaces', function () {
            var fileName = 'LAYERS_STYLES_WITH_SPACES.xml';
            var styleName = cmp.getWmsStyleFromSldFile(fileName);
            expect(styleName).to.equal('STYLES WITH SPACES');
        });
    });

    describe('#getSldFilefromWmsStyle', function() {
        it('derives the sld file name from style and layer', function () {
            var layerName = 'FOO';
            var styleName = 'BAR';

            var fileName = cmp.getSldFileFromWmsStyle(styleName, layerName);
            expect(fileName).to.equal('FOO_BAR.xml');
        });

        it('replaces spaces in style with underscores', function () {
            var layerName = 'FOO';
            var styleName = 'BAR BAZ';

            var fileName = cmp.getSldFileFromWmsStyle(styleName, layerName);
            expect(fileName).to.equal('FOO_BAR_BAZ.xml');
        });
    });

    describe('#hasLabels', function () {

        it('returns true, if all styles have labels', function () {
            var styles = [{
                label: 'foo'
            }, {
                label: 'bar'
            }];
            var hasLabels = cmp.hasLabels(styles);
            expect(hasLabels).to.be(true);
        });

        it('returns false, if at least one style has no label', function () {
            var styles = [{
                label: 'foo'
            }, {}];
            var hasLabels = cmp.hasLabels(styles);
            expect(hasLabels).to.be(false);
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
