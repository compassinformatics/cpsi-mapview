describe('CpsiMapview.controller.LayerTreeController', function () {
    Ext.Loader.syncRequire([
        'CpsiMapview.controller.LayerTreeController',
        'BasiGX.util.Layer'
    ]);

    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.controller.LayerTreeController).not.to.be(
                undefined
            );
        });
    });

    describe('createOlLayerGroups', function () {
        let ctrl;
        let rootGroup;

        beforeEach(function () {
            // use the prototype directly, as the constructor needs the main map
            // panel and adds global login/logout listeners
            ctrl = Object.create(
                CpsiMapview.controller.LayerTreeController.prototype
            );
            ctrl.treeConfDefaults = {};
            rootGroup = new ol.layer.Group({ name: 'root', layers: [] });
        });

        it('creates a layer group for a folder', function () {
            const folder = { title: 'Folder 1', leaf: false, children: [] };

            ctrl.createOlLayerGroups([folder], rootGroup);

            const group = rootGroup.getLayers().item(0);
            expect(group).to.be.an(ol.layer.Group);
            expect(group.get('name')).to.be('Folder 1');
            expect(group.get('_origTreeConf')).to.be(folder);
        });

        it('sets the folder qtip as the group description', function () {
            const folder = {
                title: 'Folder 1',
                leaf: false,
                qtip: 'HELLO',
                children: []
            };

            ctrl.createOlLayerGroups([folder], rootGroup);

            const group = rootGroup.getLayers().item(0);
            expect(group.get('description')).to.be('HELLO');
        });

        it('sets the qtip on nested folders', function () {
            const folder = {
                title: 'Folder 1',
                leaf: false,
                children: [
                    {
                        title: 'Folder 2',
                        leaf: false,
                        qtip: 'Nested',
                        children: []
                    }
                ]
            };

            ctrl.createOlLayerGroups([folder], rootGroup);

            const inner = rootGroup.getLayers().item(0).getLayers().item(0);
            expect(inner.get('description')).to.be('Nested');
        });

        it('moves a layer into its folder', function () {
            const mapLayer = new ol.layer.Vector({
                source: new ol.source.Vector()
            });
            ctrl.map = new ol.Map({ layers: [mapLayer] });

            const getLayerByStub = sinon
                .stub(BasiGX.util.Layer, 'getLayerBy')
                .returns(mapLayer);

            const folder = {
                title: 'Folder 1',
                leaf: false,
                children: [{ id: 'LAYER1', leaf: true, qtip: 'XXX' }]
            };

            ctrl.createOlLayerGroups([folder], rootGroup);
            getLayerByStub.restore();

            const group = rootGroup.getLayers().item(0);
            expect(group.getLayers().item(0)).to.be(mapLayer);
            expect(mapLayer.get('description')).to.be('XXX');
        });
    });
});
