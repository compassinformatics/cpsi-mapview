Ext.define('CpsiMapview.form.TestViewModelModel', {
    extend: 'Ext.data.Model'
});

Ext.define('CpsiMapview.form.TestViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.cmv_testviewmodel',
    mixins: ['CpsiMapview.form.ViewModelMixin']
});

describe('CpsiMapview.form.ViewModelMixin', function () {

    Ext.Loader.syncRequire(['CpsiMapview.form.ViewModelMixin']);

    it('is defined', function () {
        expect(CpsiMapview.form.ViewModelMixin).not.to.be(undefined);
    });

    it('can be instantiated', function () {
        var inst = Ext.create('CpsiMapview.form.ViewModelMixin');
        expect(inst).to.be.a(CpsiMapview.form.ViewModelMixin);
    });

    describe('Functions', function () {

        var editForm, vm, currentRecord;

        beforeEach(function () {
            // create a new view with the viewmodel and mixin
            editForm = Ext.create('Ext.window.Window', {
                viewModel: {
                    type: 'cmv_testviewmodel'
                }
            });

            vm = editForm.getViewModel();
            currentRecord = Ext.create('CpsiMapview.form.TestViewModelModel');
            vm.set('currentRecord', currentRecord);

        });

        it('timestamp is set', function () {
            var timestamp = vm.get('timestamp');
            expect(timestamp).not.to.be(undefined);
        });

        it('can get mocked featurestore', function () {

            currentRecord.featureStores = {
                test: { key: 1 }
            }

            expect(vm.getFeatureStore(currentRecord, 'test')).to.eql({ key: 1 });
        });

        it('can destroy the viewmodel', function () {
            vm.destroy();
            expect(currentRecord).not.to.be(undefined);
        });
    });

});
