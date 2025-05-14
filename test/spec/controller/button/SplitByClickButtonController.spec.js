describe('CpsiMapview.controller.button.SplitByClickButtonController', function () {
    Ext.Loader.syncRequire([
        'CpsiMapview.controller.button.SplitByClickButtonController'
    ]);

    describe('Basics', function () {
        it('is defined', function () {
            expect(
                CpsiMapview.controller.button.SplitByClickButtonController
            ).not.to.be(undefined);
        });

        it('can be created', function () {
            const ctrl =
                new CpsiMapview.controller.button.SplitByClickButtonController();
            expect(ctrl).to.not.be(undefined);
        });
    });
});
