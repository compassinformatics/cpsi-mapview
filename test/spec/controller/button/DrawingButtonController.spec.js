describe('CpsiMapview.controller.button.DrawingButtonController', function () {
    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.controller.button.DrawingButtonController).not.to.be(undefined);
        });

        it('can be created', function () {
            var ctrl = new CpsiMapview.controller.button.DrawingButtonController();
            expect(ctrl).to.not.be(undefined);
        });
    });

    describe('setSnapInteraction', function () {
        var view;
        var ctrl;
        var map;
        var drawLayer;
        var layer1;
        var layer2;
        var getLayersByStub;
        // change in future if test layers get more features
        var expectedUniqueFeaturesCount = 3;

        var filterSnapInteractions = function (map) {
            return map.getInteractions().getArray().filter(function (v) {
                return v instanceof ol.interaction.Snap;
            });
        }

        beforeEach(function () {
            // Create the component, then get a reference to the
            // controller under test so that getView() within the
            // controller returns a view, and not undefined
            view = new CpsiMapview.view.tool.DrawingButton();
            ctrl = view.getController();
            map = new ol.Map();
            ctrl.map = map;
            drawLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: new ol.Collection()
                })
            });

            var sharedFeature = new ol.Feature({
                geometry: new ol.geom.Point([0, 0])
            });

            layer1 = new ol.layer.Vector({
                isWfs: true,
                source: new ol.source.Vector({
                    features: [
                        new ol.Feature({
                            geometry: new ol.geom.LineString([[0, 0], [1, 1]])
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
                            geometry: new ol.geom.LineString([[0, 0], [1, 1]])
                        }),
                        sharedFeature
                    ]
                })
            });

            // stub BasiGX.util.Layer.getLayersBy to return test data during these tests
            getLayersByStub = sinon.stub(BasiGX.util.Layer, 'getLayersBy').callsFake(function (prop, key) {
                switch (key) {
                    case 'layer1':
                        return [layer1]
                    case 'layer2':
                        return [layer2]
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
            expect(ctrl.snapInteraction.getFeatures_().getLength()).to.be(expectedUniqueFeaturesCount);
        });

        it('should only snap to features in visible layers', function () {
            view.snappingLayerKeys = ['layer1', 'layer2'];
            layer1.setVisible(false);
            ctrl.setSnapInteraction(drawLayer);

            // layer1 and layer2 have 3 unique features
            // layer1 is hidden so the expected number of features
            // in the snap interaction should be 2
            expect(ctrl.snapInteraction.getFeatures_().getLength()).to.be(expectedUniqueFeaturesCount - 1);
        });

        it('should snap to features in non-visible layers if allowSnapToHiddenFeatures option is set', function () {
            view.snappingLayerKeys = ['layer1', 'layer2'];
            view.allowSnapToHiddenFeatures = true;
            layer1.setVisible(false);
            ctrl.setSnapInteraction(drawLayer);

            // layer1 and layer2 have 3 unique features
            // layer1 is hidden, but allowSnapToHiddenFeatures option is true
            // in the snap interaction there should be 3 features
            expect(ctrl.snapInteraction.getFeatures_().getLength()).to.be(expectedUniqueFeaturesCount);
        });

        it('should add features to snap interaction when addFeature fires', function () {
            view.snappingLayerKeys = ['layer1', 'layer2'];
            ctrl.setSnapInteraction(drawLayer);

            // add a feature after the snap interaction is set up
            layer1.getSource().addFeature(new ol.Feature({
                geometry: new ol.geom.Point([0, 0])
            }));

            expect(ctrl.snapInteraction.getFeatures_().getLength()).to.be(expectedUniqueFeaturesCount + 1);
        });

        it('should remove features from snap interaction when removeFeature fires', function () {
            view.snappingLayerKeys = ['layer1', 'layer2'];
            ctrl.setSnapInteraction(drawLayer);

            // Clear features from layer1, leaving only layer2 features
            layer1.getSource().clear()

            expect(ctrl.snapInteraction.getFeatures_().getLength()).to.be(expectedUniqueFeaturesCount - 1);
        });

        it('should add features to a snap interaction when a layer becomes visible', function () {
            view.snappingLayerKeys = ['layer1', 'layer2'];
            layer1.setVisible(false);
            ctrl.setSnapInteraction(drawLayer);

            // expect initially 2 features
            expect(ctrl.snapInteraction.getFeatures_().getLength()).to.be(expectedUniqueFeaturesCount - 1);

            layer1.setVisible(true);

            // expect all features
            expect(ctrl.snapInteraction.getFeatures_().getLength()).to.be(expectedUniqueFeaturesCount);
        });

        it('should remove features from a snap interaction when a layer becomes invisible', function () {
            view.snappingLayerKeys = ['layer1', 'layer2'];
            ctrl.setSnapInteraction(drawLayer);

            // expect all features
            expect(ctrl.snapInteraction.getFeatures_().getLength()).to.be(expectedUniqueFeaturesCount);

            layer1.setVisible(false);

            // expect 2 features
            expect(ctrl.snapInteraction.getFeatures_().getLength()).to.be(expectedUniqueFeaturesCount - 1);
        });
    });
});
