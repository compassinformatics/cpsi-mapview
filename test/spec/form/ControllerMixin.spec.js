describe('CpsiMapview.form.ControllerMixin', function () {

    it('is defined', function () {
        expect(CpsiMapview.form.ControllerMixin).not.to.be(undefined);
    });

    it('can be instantiated', function () {
        var inst = Ext.create('CpsiMapview.form.ControllerMixin');
        expect(inst).to.be.a(CpsiMapview.form.ControllerMixin);
    });

    describe('Functions', function () {

        var editForm;

        Ext.define('CpsiMapview.form.TestControllerModel', {
            extend: 'Ext.data.Model',
            fields: ['id']
        });

        Ext.define('CpsiMapview.form.TestController', {
            extend: 'Ext.app.ViewController',
            alias: 'controller.TestController',
            mixins: ['CpsiMapview.form.ControllerMixin']
        });

        beforeEach(function () {

            var model = Ext.create('CpsiMapview.form.TestControllerModel');

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
            var ctrl = editForm.getController();
            var fn = ctrl.onFieldChanged;
            expect(fn).not.to.be(undefined);
        });
    });
});
