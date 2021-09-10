describe('CpsiMapview.controller.button.DigitizeButtonController', function () {
    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.controller.button.DigitizeButtonController).not.to.be(undefined);
        });

        it('can be created', function () {
            var ctrl = new CpsiMapview.controller.button.DigitizeButtonController();
            expect(ctrl).to.not.be(undefined);
        });

        describe('Can handle service results', function () {

            var resultLayer, ctrl;

            beforeEach(function () {

                var btn = new CpsiMapview.view.button.DigitizeButton({ type: 'Point'});

                ctrl = btn.getController();
                ctrl.resultLayer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: new ol.Collection()
                    })
                });
            });


            it('#handleFinalResult fires events', function (done) {

                var features = [
                    new ol.Feature({
                        geometry: new ol.geom.LineString([[0, 0], [1, 1]]),
                        length: 10
                    }),
                    new ol.Feature({
                        geometry: new ol.geom.Point([0, 0]),
                        group: 0 // this is the default active group
                    })
                ];

                ctrl.resultLayer.getSource().on('featuresupdated', function (evt) {
                    var mods = evt.modifications;
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
    });
});
