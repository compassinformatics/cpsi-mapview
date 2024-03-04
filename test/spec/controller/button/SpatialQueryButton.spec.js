describe('CpsiMapview.controller.button.SpatialQueryButtonController', function () {

    Ext.Loader.syncRequire(['CpsiMapview.controller.button.SpatialQueryButtonController']);

    describe('Basics', function() {
        it('is defined', function() {
            expect(CpsiMapview.controller.button.SpatialQueryButtonController).not.to.be(undefined);
        });

        it('can be created', function() {
            var ctrl = new CpsiMapview.controller.button.SpatialQueryButtonController();
            expect(ctrl).to.not.be(undefined);
        });
    });
});
