Ext.define('CpsiMapview.form.TestControllerModel', {
    extend: 'Ext.data.Model',
    fields: ['id']
});

Ext.define('CpsiMapview.form.TestController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.TestController',
    mixins: ['CpsiMapview.form.ControllerMixin']
});

describe('CpsiMapview.form.ControllerMixin', function () {
    Ext.Loader.syncRequire(['CpsiMapview.form.ControllerMixin']);

    it('is defined', function () {
        expect(CpsiMapview.form.ControllerMixin).not.to.be(undefined);
    });

    it('can be instantiated', function () {
        const inst = Ext.create('CpsiMapview.form.ControllerMixin');
        expect(inst).to.be.a(CpsiMapview.form.ControllerMixin);
    });

    describe('Functions', function () {
        let editForm;

        beforeEach(function () {
            const model = Ext.create('CpsiMapview.form.TestControllerModel');

            // create a new view with the controller and mixin
            editForm = Ext.create('Ext.window.Window', {
                viewModel: {
                    currentRecord: model
                },
                controller: {
                    type: 'TestController'
                }
            });
        });

        it('#onFieldChanged is defined', function () {
            const ctrl = editForm.getController();
            const fn = ctrl.onFieldChanged;
            expect(fn).not.to.be(undefined);
        });

        it('#onDigitizingToolToggle flag and listeners are set', function () {
            const ctrl = editForm.getController();

            const source = new ol.source.Vector();
            const resultLayer = new ol.layer.Vector({ source: source });

            editForm.getViewModel().set('resultLayer', resultLayer);
            expect(ctrl.toolListenerAdded).to.be(false);
            expect(source.getListeners('featuresupdated')).to.be(undefined);
            ctrl.onDigitizingToolToggle();
            expect(ctrl.toolListenerAdded).to.be(true);
            expect(source.getListeners('featuresupdated').length).to.be(1);
            ctrl.onDigitizingToolToggle();
            // listener count should remain the same
            expect(source.getListeners('featuresupdated').length).to.be(1);
        });

        describe('Digitizing', function () {
            let polygonLayer;

            beforeEach(function () {
                const feature = new ol.Feature({ id: 'foo' });
                polygonLayer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: new ol.Collection([feature])
                    })
                });

                editForm.getViewModel().set('polygonLayer', polygonLayer);
            });

            it('#onEdgesModified polygons are removed when Point tool is used', function () {
                const ctrl = editForm.getController();

                const evt = {
                    modifications: {
                        newEdgeCount: 3,
                        toolType: 'Point'
                    }
                };

                ctrl.onEdgesModified(evt);
                expect(polygonLayer.getSource().getFeatures().length).to.be(0);
            });

            it('#onEdgesModified polygons are not removed when no new edges have been added', function () {
                const ctrl = editForm.getController();

                const evt = {
                    modifications: {
                        newEdgeCount: 0,
                        toolType: 'Point'
                    }
                };

                ctrl.onEdgesModified(evt);
                expect(polygonLayer.getSource().getFeatures().length).to.be(1);
            });

            it('#onEdgesModified polygons are not removed when Polygon tool is used', function () {
                const ctrl = editForm.getController();

                const evt = {
                    modifications: {
                        newEdgeCount: 3,
                        toolType: 'Polygon'
                    }
                };

                ctrl.onEdgesModified(evt);
                expect(polygonLayer.getSource().getFeatures().length).to.be(1);
            });

            it('#onEdgesModified polygons are not removed when Circle tool is used', function () {
                const ctrl = editForm.getController();

                const evt = {
                    modifications: {
                        newEdgeCount: 3,
                        toolType: 'Circle'
                    }
                };

                ctrl.onEdgesModified(evt);
                expect(polygonLayer.getSource().getFeatures().length).to.be(1);
            });
        });
    });
});
