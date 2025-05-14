Ext.Loader.syncRequire([
    'Ext.util.Filter',
    'Ext.data.TreeStore',
    'GeoExt.data.store.LayersTree',
    'CpsiMapview.data.model.LayerTreeNode'
]);

const createNode = function (opts) {
    const layerNode = Ext.create(
        'CpsiMapview.data.model.LayerTreeNode',
        new ol.layer.Vector({
            source: new ol.source.Vector(),
            visible: opts.visible,
            isBaseLayer: opts.isBaseLayer,
            name: opts.name
        })
    );
    return layerNode;
};

describe('CpsiMapview.util.LayerTreeFilter', function () {
    Ext.Loader.syncRequire(['CpsiMapview.util.LayerTreeFilter']);

    const layerTreeFilterUtil = CpsiMapview.util.LayerTreeFilter;

    describe('Basics', function () {
        it('is defined', function () {
            expect(layerTreeFilterUtil).not.to.be(undefined);
        });
    });

    describe('#isLayerVisible', function () {
        describe('layer', function () {
            it('returns true, if layer is visible', function () {
                const layerNode = createNode({ visible: true });
                const isVisible = layerTreeFilterUtil.isLayerVisible(
                    layerNode,
                    true
                );
                expect(isVisible).to.be(true);
            });

            it('returns false, if layer is not visible', function () {
                const layerNode = createNode({ visible: false });
                const isVisible = layerTreeFilterUtil.isLayerVisible(
                    layerNode,
                    true
                );
                expect(isVisible).to.be(false);
            });
        });

        describe('baseLayer', function () {
            it('always returns true, if baseLayers should not be filtered', function () {
                const visibleBaseLayer = createNode({
                    visible: true,
                    isBaseLayer: true
                });
                const visibleBaseLayerIsVisible =
                    layerTreeFilterUtil.isLayerVisible(visibleBaseLayer, false);
                expect(visibleBaseLayerIsVisible).to.be(true);

                const invisibleBaseLayer = createNode({
                    visible: false,
                    isBaseLayer: true
                });
                const invisibleBaseLayerIsVisible =
                    layerTreeFilterUtil.isLayerVisible(
                        invisibleBaseLayer,
                        false
                    );
                expect(invisibleBaseLayerIsVisible).to.be(true);
            });
        });
    });

    describe('#isSearchTextInLayerName', function () {
        describe('layers', function () {
            it('returns true, if text was found', function () {
                const searchText = 'foo';
                const layerName = searchText;

                const layerNode = createNode({ name: layerName });

                const result = layerTreeFilterUtil.isSearchTextInLayerName(
                    layerNode,
                    searchText,
                    true
                );

                expect(result).to.be(true);
            });

            it('returns true, if layer name contains search text', function () {
                const searchText = 'foo';
                const layerName = 'barfoobar';

                const layerNode = createNode({ name: layerName });

                const result = layerTreeFilterUtil.isSearchTextInLayerName(
                    layerNode,
                    searchText,
                    true
                );

                expect(result).to.be(true);
            });

            it('returns false, if text was not found', function () {
                const searchText = 'foo';
                const layerName = 'bar';

                const layerNode = createNode({ name: layerName });

                const result = layerTreeFilterUtil.isSearchTextInLayerName(
                    layerNode,
                    searchText,
                    true
                );

                expect(result).to.be(false);
            });
        });

        describe('baseLayers', function () {
            it('always returns true if baseLayers should not be filtered', function () {
                const searchText = 'foo';
                const layerName = 'bar';

                const matchingNode = createNode({
                    name: searchText,
                    isBaseLayer: true
                });
                const notMatchingNode = createNode({
                    name: layerName,
                    isBaseLayer: true
                });

                const matchingResult =
                    layerTreeFilterUtil.isSearchTextInLayerName(
                        matchingNode,
                        searchText,
                        false
                    );
                expect(matchingResult).to.be(true);

                const notMatchingResult =
                    layerTreeFilterUtil.isSearchTextInLayerName(
                        notMatchingNode,
                        searchText,
                        false
                    );

                expect(notMatchingResult).to.be(true);
            });
        });
    });

    describe('#createLayerTreeFilter', function () {
        let source;
        let visibleLayer;
        let invisibleLayer;
        let layerGroup;
        let olMap;
        let div;
        let store;
        const filterId = 'test';

        const findVisibleLayer = function () {
            const rec = store.findBy(function (rec) {
                return rec.get('text') === visibleLayer.get('name');
            });
            return rec !== -1;
        };

        const findInvisibleLayer = function () {
            const rec = store.findBy(function (rec) {
                return rec.get('text') === invisibleLayer.get('name');
            });
            return rec !== -1;
        };

        const findLayerGroup = function () {
            const rec = store.findBy(function (rec) {
                return rec.get('text') === layerGroup.get('name');
            });
            return rec !== -1;
        };

        beforeEach(function () {
            source = new ol.source.Vector();
            visibleLayer = new ol.layer.Vector({
                source: source,
                visible: true,
                name: 'foo'
            });
            invisibleLayer = new ol.layer.Vector({
                source: source,
                visible: false,
                name: 'bar'
            });
            layerGroup = new ol.layer.Group({
                layers: [],
                name: 'mygroup'
            });
            div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.top = '0';
            div.style.left = '-1000px';
            div.style.width = '512px';
            div.style.height = '256px';
            document.body.appendChild(div);

            olMap = new ol.Map({
                target: div,
                layers: [layerGroup],
                view: new ol.View({
                    center: [0, 0],
                    zoom: 2
                })
            });

            store = Ext.create('GeoExt.data.store.LayersTree', {
                layerGroup: olMap.getLayerGroup()
            });
            olMap.getLayerGroup().getLayers().insertAt(0, invisibleLayer);
            olMap.getLayerGroup().getLayers().insertAt(0, visibleLayer);
        });

        afterEach(function () {
            store.removeFilter(filterId);
            store.removeAll();
        });

        it('finds visibleLayer', function () {
            const foundVisibleLayer = findVisibleLayer();
            expect(foundVisibleLayer).to.be(true);
        });

        it('finds invisibleLayer', function () {
            const foundInvisibleLayer = findInvisibleLayer();
            expect(foundInvisibleLayer).to.be(true);
        });

        it('finds layerGroup', function () {
            const foundLayerGroup = findLayerGroup();
            expect(foundLayerGroup).to.be(true);
        });

        it('filters by name', function () {
            const searchText = visibleLayer.get('name');

            const filter = layerTreeFilterUtil.createLayerTreeFilter(
                filterId,
                false,
                searchText,
                false
            );
            store.addFilter(filter);

            const foundVisibleLayer = findVisibleLayer();
            const foundInvisibleLayer = findInvisibleLayer();

            expect(foundVisibleLayer).to.be(true);
            expect(foundInvisibleLayer).to.be(false);
        });

        it('filters by visibility', function () {
            const hideInvisibleLayers = true;

            const filter = layerTreeFilterUtil.createLayerTreeFilter(
                filterId,
                hideInvisibleLayers,
                '',
                false
            );
            store.addFilter(filter);

            const foundVisibleLayer = findVisibleLayer();
            const foundInvisibleLayer = findInvisibleLayer();

            expect(foundVisibleLayer).to.be(true);
            expect(foundInvisibleLayer).to.be(false);
        });

        it('filters by visibility and name', function () {
            const hideInvisibleLayers = true;
            const searchText = invisibleLayer.get('name');

            const filter = layerTreeFilterUtil.createLayerTreeFilter(
                filterId,
                hideInvisibleLayers,
                searchText,
                false
            );
            store.addFilter(filter);

            const foundVisibleLayer = findVisibleLayer();
            const foundInvisibleLayer = findInvisibleLayer();

            expect(foundVisibleLayer).to.be(false);
            expect(foundInvisibleLayer).to.be(false);
        });

        it('removes empty folders', function () {
            const hideInvisibleLayers = true;
            const searchText = invisibleLayer.get('name');

            const filter = layerTreeFilterUtil.createLayerTreeFilter(
                filterId,
                hideInvisibleLayers,
                searchText,
                false
            );
            store.addFilter(filter);

            const foundLayerGroup = findLayerGroup();
            expect(foundLayerGroup).to.be(false);
        });
    });
});
