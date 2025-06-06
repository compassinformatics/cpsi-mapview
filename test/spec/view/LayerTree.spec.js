describe('CpsiMapview.view.LayerTree', function () {
    Ext.Loader.syncRequire(['CpsiMapview.view.LayerTree']);

    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.view.LayerTree).not.to.be(undefined);
        });

        it('can be instantiated', function () {
            // overwrite helper functions to derive entities
            CpsiMapview.view.main.Map.guess = function () {
                return { on: Ext.emptyFn };
            };
            const inst = Ext.create('CpsiMapview.view.LayerTree', {});
            expect(inst).to.be.a(CpsiMapview.view.LayerTree);
        });
    });
});
