describe('CpsiMapview.view.button.PermalinkButton', function () {
    Ext.Loader.syncRequire(['CpsiMapview.view.button.PermalinkButton']);

    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.view.button.PermalinkButton).not.to.be(undefined);
        });

        it('can be instantiated', function () {
            var inst = Ext.create('CpsiMapview.view.button.PermalinkButton');
            expect(inst).to.be.a(CpsiMapview.view.button.PermalinkButton);
        });

        it('can be instantiated with a custom dialog size', function () {
            var inst = Ext.create('CpsiMapview.view.button.PermalinkButton', { dialogWidth: 550 });
            expect(inst.getController().getView().dialogWidth).to.equal(550);
        });
    });
});
