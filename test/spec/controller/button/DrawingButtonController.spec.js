describe('CpsiMapview.controller.button.DrawingButtonController', function () {
    Ext.Loader.syncRequire([
        'CpsiMapview.view.button.DrawingButton',
        'CpsiMapview.controller.button.DrawingButtonController',
        'BasiGX.util.Layer'
    ]);

    describe('Basics', function () {
        it('is defined', function () {
            expect(
                CpsiMapview.controller.button.DrawingButtonController
            ).not.to.be(undefined);
        });

        it('can be created', function () {
            const ctrl =
                new CpsiMapview.controller.button.DrawingButtonController();
            expect(ctrl).to.not.be(undefined);
        });
    });

    describe('setSnapInteraction', function () {
        let view;
        let ctrl;
        let map;
        let drawLayer;
        let layer1;
        let layer2;
        let layer3;
        let getLayersByStub;
        // change in future if test layers get more features
        const expectedUniqueFeaturesCount = 3;

        const filterSnapInteractions = function (map) {
            return map
                .getInteractions()
                .getArray()
                .filter(function (v) {
                    return v instanceof ol.interaction.Snap;
                });
        };

        beforeEach(function () {
            // Create the component, then get a reference to the
            // controller under test so that getView() within the
            // controller returns a view, and not undefined
            view = new CpsiMapview.view.button.DrawingButton();
            ctrl = view.getController();
            map = new ol.Map();
            ctrl.map = map;
            drawLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: new ol.Collection()
                })
            });

            const sharedFeature = new ol.Feature({
                geometry: new ol.geom.Point([0, 0])
            });

            layer1 = new ol.layer.Vector({
                isWfs: true,
                source: new ol.source.Vector({
                    features: [
                        new ol.Feature({
                            geometry: new ol.geom.LineString([
                                [0, 0],
                                [1, 1]
                            ]),
                            nodeIdFrom: 1,
                            nodeIdTo: 2
                        }),
                        sharedFeature
                    ]
                })
            });

            layer2 = new ol.layer.Vector({
                isWfs: true,
                source: new ol.source.Vector({
                    features: [
                        new ol.Feature({
                            geometry: new ol.geom.LineString([
                                [0, 0],
                                [1, 1]
                            ])
                        }),
                        sharedFeature
                    ]
                })
            });

            const feat3 = new ol.Feature({
                geometry: new ol.geom.LineString([
                    [0, 0],
                    [1, 1]
                ]),
                nodeIdFrom: 1,
                nodeIdTo: 2
            });

            feat3.setId(3);

            const feat4 = new ol.Feature({
                geometry: new ol.geom.LineString([
                    [1, 1],
                    [2, 2]
                ]),
                nodeIdFrom: 2,
                nodeIdTo: 3
            });

            feat4.setId(4);

            layer3 = new ol.layer.Vector({
                isWfs: true,
                source: new ol.source.Vector({
                    features: [feat3, feat4]
                })
            });

            // stub BasiGX.util.Layer.getLayersBy to return test data during these tests
            getLayersByStub = sinon
                .stub(BasiGX.util.Layer, 'getLayersBy')
                .callsFake(function (prop, key) {
                    switch (key) {
                        case 'layer1':
                            return [layer1];
                        case 'layer2':
                            return [layer2];
                    }
                });
        });

        afterEach(function () {
            getLayersByStub.restore();
        });

        it('should add a Snap Interaction to the map', function () {
            expect(filterSnapInteractions(map).length).to.be(0);
            ctrl.setSnapInteraction(drawLayer);
            expect(filterSnapInteractions(map).length).to.be(1);
        });

        it('should remove the previous Snap Interaction if method is called again', function () {
            expect(filterSnapInteractions(map).length).to.be(0);
            ctrl.setSnapInteraction(drawLayer);
            expect(filterSnapInteractions(map).length).to.be(1);
            ctrl.setSnapInteraction(drawLayer);
            expect(filterSnapInteractions(map).length).to.be(1);
        });

        it('should add unique features from layers defined in snappingLayerKeys into the Snap Interaction features', function () {
            view.snappingLayerKeys = ['layer1', 'layer2'];
            ctrl.setSnapInteraction(drawLayer);

            // layer1 and layer2 have 4 features in total, but only 3 unique features
            expect(ctrl.snapInteraction.getFeatures_().getLength()).to.be(
                expectedUniqueFeaturesCount
            );
        });

        it('should only snap to features in visible layers', function () {
            view.snappingLayerKeys = ['layer1', 'layer2'];
            layer1.setVisible(false);
            ctrl.setSnapInteraction(drawLayer);

            // layer1 and layer2 have 3 unique features
            // layer1 is hidden so the expected number of features
            // in the snap interaction should be 2
            expect(ctrl.snapInteraction.getFeatures_().getLength()).to.be(
                expectedUniqueFeaturesCount - 1
            );
        });

        it('should snap to features in non-visible layers if allowSnapToHiddenFeatures option is set', function () {
            view.snappingLayerKeys = ['layer1', 'layer2'];
            view.allowSnapToHiddenFeatures = true;
            layer1.setVisible(false);
            ctrl.setSnapInteraction(drawLayer);

            // layer1 and layer2 have 3 unique features
            // layer1 is hidden, but allowSnapToHiddenFeatures option is true
            // in the snap interaction there should be 3 features
            expect(ctrl.snapInteraction.getFeatures_().getLength()).to.be(
                expectedUniqueFeaturesCount
            );
        });

        it('should add features to snap interaction when addFeature fires', function () {
            view.snappingLayerKeys = ['layer1', 'layer2'];
            ctrl.setSnapInteraction(drawLayer);

            // add a feature after the snap interaction is set up
            layer1.getSource().addFeature(
                new ol.Feature({
                    geometry: new ol.geom.Point([0, 0])
                })
            );

            expect(ctrl.snapInteraction.getFeatures_().getLength()).to.be(
                expectedUniqueFeaturesCount + 1
            );
        });

        it('should remove features from snap interaction when removeFeature fires', function () {
            view.snappingLayerKeys = ['layer1', 'layer2'];
            ctrl.setSnapInteraction(drawLayer);

            // Clear features from layer1, leaving only layer2 features
            layer1.getSource().clear();

            expect(ctrl.snapInteraction.getFeatures_().getLength()).to.be(
                expectedUniqueFeaturesCount - 1
            );
        });

        it('should add features to a snap interaction when a layer becomes visible', function () {
            view.snappingLayerKeys = ['layer1', 'layer2'];
            layer1.setVisible(false);
            ctrl.setSnapInteraction(drawLayer);

            // expect initially 2 features
            expect(ctrl.snapInteraction.getFeatures_().getLength()).to.be(
                expectedUniqueFeaturesCount - 1
            );

            layer1.setVisible(true);

            // expect all features
            expect(ctrl.snapInteraction.getFeatures_().getLength()).to.be(
                expectedUniqueFeaturesCount
            );
        });

        it('should remove features from a snap interaction when a layer becomes invisible', function () {
            view.snappingLayerKeys = ['layer1', 'layer2'];
            ctrl.setSnapInteraction(drawLayer);

            // expect all features
            expect(ctrl.snapInteraction.getFeatures_().getLength()).to.be(
                expectedUniqueFeaturesCount
            );

            layer1.setVisible(false);

            // expect 2 features
            expect(ctrl.snapInteraction.getFeatures_().getLength()).to.be(
                expectedUniqueFeaturesCount - 1
            );
        });

        it('can get a buffered coord', function () {
            const coord = [0, 0];
            ctrl.map.getView().setResolution(1); // we need a map resolution to calculate the buffer

            const extent = ctrl.getBufferedCoordExtent(coord);
            const expectedExtent = [-3, -3, 3, 3];
            expect(ol.extent.equals(extent, expectedExtent)).to.be(true);
        });

        it('can get a snapped edge', function () {
            const coord = [0, 0];
            ctrl.map.getView().setResolution(1); // we need a map resolution to calculate the buffer
            const searchLayer = layer1;
            const edge = ctrl.getSnappedEdge(coord, searchLayer);
            expect(edge).to.not.be(null);
        });

        it('no snapped edge returned if the coord is not within buffer', function () {
            const coord = [100, 100];
            ctrl.map.getView().setResolution(1); // we need a map resolution to calculate the buffer
            const searchLayer = layer1;
            const edge = ctrl.getSnappedEdge(coord, searchLayer);
            expect(edge).to.be(null);
        });

        it('can get NodeId from start of snapped edge', function () {
            const coord = [0, 0];
            // set a low resolution or the buffer covers both ends of the line
            ctrl.map.getView().setResolution(1);
            const edgesLayer = layer1;
            const edgeLayerConfig = {
                startNodeProperty: 'nodeIdFrom',
                endNodeProperty: 'nodeIdTo'
            };

            const nodeId = ctrl.getNodeIdFromSnappedEdge(
                edgesLayer,
                edgeLayerConfig,
                coord
            );
            expect(nodeId).to.be(1);
        });

        it('can get NodeId from end of snapped edge', function () {
            const coord = [1, 1];
            ctrl.map.getView().setResolution(1);
            const edgesLayer = layer1;
            const edgeLayerConfig = {
                startNodeProperty: 'nodeIdFrom',
                endNodeProperty: 'nodeIdTo'
            };

            const nodeId = ctrl.getNodeIdFromSnappedEdge(
                edgesLayer,
                edgeLayerConfig,
                coord
            );
            expect(nodeId).to.be(2);
        });

        it('can calculate line intersections', function (done) {
            view.snappingLayerKeys = ['layer1', 'layer2'];

            view.edgeLayerConfig = {
                startNodeProperty: 'nodeIdFrom',
                endNodeProperty: 'nodeIdTo'
            };
            view.edgeLayerKey = 'layer1';

            ctrl.setSnapInteraction(drawLayer);
            ctrl.drawLayer = drawLayer;
            ctrl.map.getView().setResolution(1);

            const inputFeature = new ol.Feature({
                geometry: new ol.geom.LineString([
                    [1, 1],
                    [10, 10]
                ])
            });

            drawLayer.getSource().on('localdrawend', function (evt) {
                // console.log(evt.result);
                expect(evt.result.startNodeId).to.be(2);
                expect(evt.result.endNodeId).to.be(null);
                done();
            });

            ctrl.calculateLineIntersections(inputFeature);
        });

        it('snap to self at an intersection', function () {
            const coord = [1, 1];
            ctrl.map.getView().setResolution(1);
            const selectedFeat = ctrl.getSnappedEdge(coord, layer3);
            expect(selectedFeat.getId()).to.be(3);
        });
        it('avoid snapping an edge to itself at an intersection by setting an associated record', function () {
            const coord = [1, 1];

            // associate a record with the controller
            // mock a record with a getId function
            const rec = {
                getId: function () {
                    return 3;
                } // 1 matches the Id of feat1
            };
            ctrl.getView().setParentRecord(rec);
            ctrl.map.getView().setResolution(1);

            const selectedFeat = ctrl.getSnappedEdge(coord, layer3);
            expect(selectedFeat.getId()).to.be(4);
        });
    });
});
