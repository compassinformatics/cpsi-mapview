describe('CpsiMapview.controller.MapController', function () {
    Ext.Loader.syncRequire(['CpsiMapview.controller.MapController']);

    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.controller.MapController).not.to.be(undefined);
        });

        it('can be created', function () {
            const ctrl = new CpsiMapview.controller.MapController();
            expect(ctrl).to.not.be(undefined);
        });
    });
});
