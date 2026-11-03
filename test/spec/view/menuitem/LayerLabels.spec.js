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

        describe('labels config', function () {
            it('is not hidden with a WMS layer and labelClassName set', function () {
                const layer = new ol.layer.Image({
                    source: new ol.source.ImageWMS()
                });
                layer.set('labelClassName', 'LabelsDefault');
                const inst = Ext.create(
                    'CpsiMapview.view.menuitem.LayerLabels',
                    {
                        layer: layer
                    }
                );
                expect(inst.labelClassName).to.be('LabelsDefault');
                expect(inst.isHidden()).to.be(false);
            });

            it('treats a single-entry labels array like labelClassName', function () {
                const layer = new ol.layer.Image({
                    source: new ol.source.ImageWMS()
                });
                layer.set('labels', [
                    { name: 'LabelsDefault', title: 'Default' }
                ]);
                const inst = Ext.create(
                    'CpsiMapview.view.menuitem.LayerLabels',
                    {
                        layer: layer
                    }
                );
                expect(inst.labelClassName).to.be('LabelsDefault');
                expect(inst.menu).to.be(undefined);
                expect(inst.isHidden()).to.be(false);
            });

            it('builds a submenu with a multi-entry labels array', function () {
                const layer = new ol.layer.Image({
                    source: new ol.source.ImageWMS()
                });
                layer.set('labels', [
                    { name: 'LabelsRoads', title: 'Road names' },
                    { name: 'LabelsRivers', title: 'River names' }
                ]);
                const inst = Ext.create(
                    'CpsiMapview.view.menuitem.LayerLabels',
                    {
                        layer: layer
                    }
                );
                expect(inst.labelOptions.length).to.be(2);
                expect(inst.isHidden()).to.be(false);
                // 'None' + 2 configured options
                expect(inst.menu.items.length).to.be(3);
            });
        });
    });
});
