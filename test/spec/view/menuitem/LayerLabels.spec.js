describe('CpsiMapview.view.menuitem.LayerLabels', function () {
    Ext.Loader.syncRequire(['CpsiMapview.view.menuitem.LayerLabels']);

    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.view.menuitem.LayerLabels).not.to.be(undefined);
        });

        it('can be instantiated', function () {
            const inst = Ext.create('CpsiMapview.view.menuitem.LayerLabels');
            expect(inst).to.be.a(CpsiMapview.view.menuitem.LayerLabels);
        });

        it('can be instantiated with a Vector layer', function () {
            const layer = new ol.layer.Vector({
                source: new ol.source.Vector()
            });

            const inst = Ext.create('CpsiMapview.view.menuitem.LayerLabels', {
                layer: layer
            });
            expect(inst.clientSideStyle).to.be(true);
            expect(inst.isHidden()).to.be(true);
        });

        it('can be instantiated with a VectorTile layer', function () {
            const layer = new ol.layer.VectorTile({
                isVt: true,
                source: new ol.source.VectorTile({
                    format: 'mvt',
                    url: '/mapserver/?FORMAT=mvt'
                })
            });

            const inst = Ext.create('CpsiMapview.view.menuitem.LayerLabels', {
                layer: layer
            });
            expect(inst.clientSideStyle).to.be(true);
            expect(inst.isHidden()).to.be(true);
        });

        it('can be instantiated with a TileWMS layer', function () {
            const layer = new ol.layer.Image({
                source: new ol.source.TileWMS()
            });

            const inst = Ext.create('CpsiMapview.view.menuitem.LayerLabels', {
                layer: layer
            });
            expect(inst.clientSideStyle).to.be(false);
            expect(inst.isHidden()).to.be(true);
        });

        it('can be instantiated with a ImageWMS layer', function () {
            const layer = new ol.layer.Image({
                source: new ol.source.ImageWMS()
            });

            const inst = Ext.create('CpsiMapview.view.menuitem.LayerLabels', {
                layer: layer
            });
            expect(inst.clientSideStyle).to.be(false);
            expect(inst.isHidden()).to.be(true);
        });
    });
});
