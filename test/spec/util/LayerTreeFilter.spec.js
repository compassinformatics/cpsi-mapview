Ext.Loader.syncRequire([
    'Ext.util.Filter',
    'Ext.data.TreeStore',
    'GeoExt.data.store.LayersTree',
    'CpsiMapview.data.model.LayerTreeNode'
]);

var createNode = function(opts) {
    var layerNode = Ext.create(
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

describe('CpsiMapview.util.LayerTreeFilter', function() {
    var layerTreeFilterUtil = CpsiMapview.util.LayerTreeFilter;

    describe('Basics', function() {
        it('is defined', function() {
            expect(layerTreeFilterUtil).not.to.be(undefined);
        });
    });

    describe('#isLayerVisible', function() {

        describe('layer', function() {

            it('returns true, if layer is visible', function() {
                var layerNode = createNode({visible: true});
                var isVisible = layerTreeFilterUtil.isLayerVisible(layerNode, true);
                expect(isVisible).to.be(true);
            });

            it('returns false, if layer is not visible', function() {
                var layerNode = createNode({visible: false});
                var isVisible = layerTreeFilterUtil.isLayerVisible(layerNode, true);
                expect(isVisible).to.be(false);
            });

        });

        describe('baseLayer', function() {

            it('always returns true, if baseLayers should not be filtered', function() {
                var visibleBaseLayer = createNode({visible: true, isBaseLayer: true});
                var visibleBaseLayerIsVisible = layerTreeFilterUtil.isLayerVisible(
                    visibleBaseLayer, false);
                expect(visibleBaseLayerIsVisible).to.be(true);

                var invisibleBaseLayer = createNode({visible: false, isBaseLayer: true});
                var invisibleBaseLayerIsVisible = layerTreeFilterUtil.isLayerVisible(
                    invisibleBaseLayer, false);
                expect(invisibleBaseLayerIsVisible).to.be(true);
            });
        });
    });

    describe('#isSearchTextInLayerName', function() {

        describe('layers', function() {

            it('returns true, if text was found', function() {
                var searchText = 'foo';
                var layerName = searchText;

                var layerNode = createNode({name: layerName});

                var result = layerTreeFilterUtil.isSearchTextInLayerName(
                    layerNode,
                    searchText,
                    true
                );

                expect(result).to.be(true);
            });

            it('returns true, if layer name contains search text', function() {
                var searchText = 'foo';
                var layerName = 'barfoobar';

                var layerNode = createNode({name: layerName});

                var result = layerTreeFilterUtil.isSearchTextInLayerName(
                    layerNode,
                    searchText,
                    true
                );

                expect(result).to.be(true);
            });

            it('returns false, if text was not found', function() {
                var searchText = 'foo';
                var layerName = 'bar';

                var layerNode = createNode({name: layerName});

                var result = layerTreeFilterUtil.isSearchTextInLayerName(
                    layerNode,
                    searchText,
                    true
                );

                expect(result).to.be(false);
            });
        });

        describe('baseLayers', function() {

            it('always returns true if baseLayers should not be filtered', function() {
                var searchText = 'foo';
                var layerName = 'bar';

                var matchingNode = createNode({name: searchText, isBaseLayer: true});
                var notMatchingNode = createNode({name: layerName, isBaseLayer: true});

                var matchingResult = layerTreeFilterUtil.isSearchTextInLayerName(
                    matchingNode,
                    searchText,
                    false
                );
                expect(matchingResult).to.be(true);

                var notMatchingResult = layerTreeFilterUtil.isSearchTextInLayerName(
                    notMatchingNode,
                    searchText,
                    false
                );

                expect(notMatchingResult).to.be(true);
            });
        });

    });

    describe('#createLayerTreeFilter', function() {

        var source;
        var visibleLayer;
        var invisibleLayer;
        var layerGroup;
        var olMap;
        var div;
        var store;
        var filterId = 'test';

        var findVisibleLayer = function() {
            var rec = store.findBy(function(rec) {
                return rec.get('text') === visibleLayer.get('name');
            });
            return rec !== -1;
        };

        var findInvisibleLayer = function() {
            var rec = store.findBy(function(rec) {
                return rec.get('text') === invisibleLayer.get('name');
            });
            return rec !== -1;
        };

        var findLayerGroup = function() {
            var rec = store.findBy(function(rec) {
                return rec.get('text') === layerGroup.get('name');
            });
            return rec !== -1;
        };

        beforeEach(function() {
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

        afterEach(function() {
            store.removeFilter(filterId);
            store.removeAll();
        });

        it('finds visibleLayer', function() {
            var foundVisibleLayer = findVisibleLayer();
            expect(foundVisibleLayer).to.be(true);
        });

        it('finds invisibleLayer', function() {
            var foundInvisibleLayer = findInvisibleLayer();
            expect(foundInvisibleLayer).to.be(true);

        });

        it('finds layerGroup', function() {
            var foundLayerGroup = findLayerGroup();
            expect(foundLayerGroup).to.be(true);
        });

        it('filters by name', function() {
            var searchText = visibleLayer.get('name');

            var filter = layerTreeFilterUtil.createLayerTreeFilter(
                filterId,
                false,
                searchText,
                false
            );
            store.addFilter(filter);

            var foundVisibleLayer = findVisibleLayer();
            var foundInvisibleLayer = findInvisibleLayer();

            expect(foundVisibleLayer).to.be(true);
            expect(foundInvisibleLayer).to.be(false);
        });

        it('filters by visibility', function() {
            var hideInvisibleLayers = true;

            var filter = layerTreeFilterUtil.createLayerTreeFilter(
                filterId,
                hideInvisibleLayers,
                '',
                false
            );
            store.addFilter(filter);

            var foundVisibleLayer = findVisibleLayer();
            var foundInvisibleLayer = findInvisibleLayer();

            expect(foundVisibleLayer).to.be(true);
            expect(foundInvisibleLayer).to.be(false);
        });

        it('filters by visibility and name', function() {
            var hideInvisibleLayers = true;
            var searchText = invisibleLayer.get('name');

            var filter = layerTreeFilterUtil.createLayerTreeFilter(
                filterId,
                hideInvisibleLayers,
                searchText,
                false
            );
            store.addFilter(filter);

            var foundVisibleLayer = findVisibleLayer();
            var foundInvisibleLayer = findInvisibleLayer();

            expect(foundVisibleLayer).to.be(false);
            expect(foundInvisibleLayer).to.be(false);
        });

        it('removes empty folders', function() {
            var hideInvisibleLayers = true;
            var searchText = invisibleLayer.get('name');

            var filter = layerTreeFilterUtil.createLayerTreeFilter(
                filterId,
                hideInvisibleLayers,
                searchText,
                false
            );
            store.addFilter(filter);

            var foundLayerGroup = findLayerGroup();
            expect(foundLayerGroup).to.be(false);
        });

    });

});
