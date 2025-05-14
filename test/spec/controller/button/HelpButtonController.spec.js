describe('CpsiMapview.controller.button.HelpButtonController', function () {
    Ext.Loader.syncRequire([
        'CpsiMapview.controller.button.HelpButtonController'
    ]);

    describe('Basics', function () {
        it('is defined', function () {
            expect(
                CpsiMapview.controller.button.HelpButtonController
            ).not.to.be(undefined);
        });

        it('can be created', function () {
            const ctrl =
                new CpsiMapview.controller.button.HelpButtonController();
            expect(ctrl).to.not.be(undefined);
        });
    });
});
