describe('CpsiMapview.util.Style', function () {
    Ext.Loader.syncRequire(['CpsiMapview.util.Style']);
    var styleUtil = CpsiMapview.util.Style;

    describe('Basics', function () {
        it('is defined', function () {
            expect(styleUtil).not.to.be(undefined);
        });
    });

    describe('Functions', function () {

        it('createClusterStyle', function () {
            var fn = styleUtil.createClusterStyle;
            expect(fn).not.to.be(undefined);

            var style = fn(5);
            expect(style.getText().getText()).to.be('5');
        });

        it('getStyleByName', function () {
            var layer = new ol.layer.Vector({
                styles: [
                    { name: 'test1' },
                    { name: 'test2' }
                ]
            });

            var style = styleUtil.getStyleByName(layer, 'test2');
            expect(style.name).to.be('test2');
        });

        it('getLayerStyleTitle', function () {
            var layer = new ol.layer.Vector({
                styles: [
                    { name: 'test1', title: 'title1' },
                    { name: 'test2', title: 'title2' }
                ]
            });

            var title = styleUtil.getLayerStyleTitle('test2', layer);
            expect(title).to.be('title2');
        });
    });
});
