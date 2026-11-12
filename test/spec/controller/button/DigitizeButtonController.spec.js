describe('CpsiMapview.controller.button.DigitizeButtonController', function () {
    Ext.Loader.syncRequire([
        'CpsiMapview.controller.button.DigitizeButtonController'
    ]);

    describe('Basics', function () {
        it('is defined', function () {
            expect(
                CpsiMapview.controller.button.DigitizeButtonController
            ).not.to.be(undefined);
        });

        it('can be created', function () {
            const ctrl =
                new CpsiMapview.controller.button.DigitizeButtonController();
            expect(ctrl).to.not.be(undefined);
        });

        describe('Can handle service results', function () {
            let ctrl;

            beforeEach(function () {
                const btn = new CpsiMapview.view.button.DigitizeButton({
                    type: 'Point'
                });

                ctrl = btn.getController();
                ctrl.resultLayer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: new ol.Collection()
                    })
                });
            });

            it('#parseNetsolverResponse handles valid response', function () {
                const response = {
                    responseText:
                        '{"data":{"type":"FeatureCollection","features":[' +
                        '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[0,0],[1,1]]},"properties":{}}],' +
                        '"crs":{"type":"name","properties":{"name":"EPSG: 3857"}},"bbox":null},"message":"","success":true}'
                };
                ctrl.parseNetsolverResponse(response);
            });

            it('#parseNetsolverResponse handles empty response', function () {
                const response = {
                    responseText: '{"data":null,"message":"","success":true}'
                };

                ctrl.parseNetsolverResponse(response);
            });

            it('#handleFinalResult fires events', function (done) {
                const features = [
                    new ol.Feature({
                        geometry: new ol.geom.LineString([
                            [0, 0],
                            [1, 1]
                        ]),
                        length: 10
                    }),
                    new ol.Feature({
                        geometry: new ol.geom.Point([0, 0]),
                        group: 0 // this is the default active group
                    })
                ];

                ctrl.resultLayer
                    .getSource()
                    .on('featuresupdated', function (evt) {
                        const mods = evt.modifications;
                        expect(mods.originalLength).to.be(0);
                        expect(mods.newLength).to.be(10);
                        expect(mods.newEdgeCount).to.be(1);
                        expect(mods.originalSolverPoints.length).to.be(0);
                        expect(mods.newSolverPoints.length).to.be(1);
                        expect(mods.toolType).to.be('Point');
                        done();
                    });

                ctrl.handleFinalResult(features);
            });
        });

        describe('Groups', function () {
            let btn;
            let ctrl;

            /**
             * Adds a line feature for each of the given groups
             * to the result layer
             * @param {number[]} groups
             */
            const addGroupFeatures = function (groups) {
                ctrl.resultLayer.getSource().addFeatures(
                    groups.map(function (group) {
                        return new ol.Feature({
                            geometry: new ol.geom.LineString([
                                [0, 0],
                                [1, 1]
                            ]),
                            group: group
                        });
                    })
                );
            };

            beforeEach(function () {
                btn = new CpsiMapview.view.button.DigitizeButton({
                    type: 'LineString',
                    groups: true
                });

                ctrl = btn.getController();
                // needed as updateDrawSource reads the draw layer source
                ctrl.drawLayer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: new ol.Collection()
                    })
                });
                ctrl.resultLayer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: new ol.Collection()
                    })
                });
            });

            it('#getFeatureGroups returns distinct groups', function () {
                addGroupFeatures([1, 4, 4, 5]);

                const groups = ctrl.getFeatureGroups();
                expect(groups.length).to.be(3);
                expect(groups).to.contain(1);
                expect(groups).to.contain(4);
                expect(groups).to.contain(5);
            });

            it('#getFeatureGroups ignores features without a group', function () {
                ctrl.resultLayer.getSource().addFeature(
                    new ol.Feature(
                        new ol.geom.LineString([
                            [0, 0],
                            [1, 1]
                        ])
                    )
                );

                expect(ctrl.getFeatureGroups()).to.eql([]);
            });

            it('#getGroupIndexes includes the active group and sorts', function () {
                addGroupFeatures([10, 2, 5]);
                ctrl.activeGroupIdx = 0;

                expect(ctrl.getGroupIndexes()).to.eql([0, 2, 5, 10]);
            });

            it('#syncGroupsFromResultLayer updates counter and active group', function () {
                addGroupFeatures([1, 4, 5]);

                ctrl.syncGroupsFromResultLayer();

                expect(ctrl.contextMenuGroupsCounter).to.be(5);
                expect(ctrl.activeGroupIdx).to.be(1);
            });

            it('#syncGroupsFromResultLayer keeps an active group 0 with features', function () {
                addGroupFeatures([0, 3]);

                ctrl.syncGroupsFromResultLayer();

                expect(ctrl.contextMenuGroupsCounter).to.be(3);
                expect(ctrl.activeGroupIdx).to.be(0);
            });

            it('#getActiveGroupMenuItems uses the group values as labels', function () {
                addGroupFeatures([1, 4]);
                ctrl.activeGroupIdx = 4;

                const items = ctrl.getActiveGroupMenuItems();

                expect(items.length).to.be(2);
                expect(items[0].text).to.be('Group 1');
                expect(items[0].checked).to.be(false);
                expect(items[1].text).to.be('Group 4');
                expect(items[1].checked).to.be(true);
            });

            it('#applyGroupStyle mutes inactive groups only when pressed', function () {
                const baseStyle = new ol.style.Style();
                ctrl.resultLayer.setStyle(baseStyle);
                ctrl.activeGroupIdx = 1;

                ctrl.applyGroupStyle();

                const styleFn = ctrl.resultLayer.getStyle();
                const active = new ol.Feature({ group: 1 });
                const inactive = new ol.Feature({ group: 2 });

                expect(ctrl.resultLayer.get('groupStyled')).to.be(true);

                btn.pressed = false;
                expect(styleFn(inactive, 1)).to.be(baseStyle);

                btn.pressed = true;
                expect(styleFn(active, 1)).to.be(baseStyle);
                expect(styleFn(inactive, 1)).not.to.be(baseStyle);
            });

            it('#applyGroupStyle only wraps the style once', function () {
                ctrl.applyGroupStyle();
                const styleFn = ctrl.resultLayer.getStyle();

                ctrl.applyGroupStyle();

                expect(ctrl.resultLayer.getStyle()).to.be(styleFn);
            });

            it('clearing the result source resets the groups', function () {
                ctrl.applyGroupStyle();
                ctrl.activeGroupIdx = 4;
                ctrl.contextMenuGroupsCounter = 5;

                ctrl.resultLayer.getSource().clear();

                expect(ctrl.activeGroupIdx).to.be(0);
                expect(ctrl.contextMenuGroupsCounter).to.be(0);
            });

            it('#handleFinalResult keeps features of group 0', function () {
                addGroupFeatures([0]);
                ctrl.activeGroupIdx = 1;

                ctrl.handleFinalResult([
                    new ol.Feature({
                        geometry: new ol.geom.LineString([
                            [0, 0],
                            [1, 1]
                        ]),
                        group: 1
                    })
                ]);

                expect(ctrl.getFeatureGroups().sort()).to.eql([0, 1]);
            });
        });
    });
});
