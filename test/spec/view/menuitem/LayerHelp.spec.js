describe('CpsiMapview.view.menuitem.LayerHelp', function () {
    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.view.menuitem.LayerHelp).not.to.be(undefined);
        });

        it('can be instantiated', function () {
            const layer = new ol.layer.Image();
            const inst = Ext.create('CpsiMapview.view.menuitem.LayerHelp', {
                layer: layer
            });
            expect(inst).to.be.a(CpsiMapview.view.menuitem.LayerHelp);
        });

        it('is hidden when a helpUrl is not set on a layer', function () {
            const layer = new ol.layer.Image();
            const inst = Ext.create('CpsiMapview.view.menuitem.LayerHelp', {
                layer: layer
            });
            expect(inst.hidden).to.be(true);
        });

        it('is visible when a helpUrl is set on a layer', function () {
            const layer = new ol.layer.Image();
            layer.set('helpUrl', 'test.html');
            const inst = Ext.create('CpsiMapview.view.menuitem.LayerHelp', {
                layer: layer
            });
            expect(inst.hidden).to.be(false);
        });
    });
});
