describe('CpsiMapview.view.button.HelpButton', function () {
    Ext.Loader.syncRequire(['CpsiMapview.view.button.HelpButton']);

    describe('Basics', function() {
        it('is defined', function() {
            expect(CpsiMapview.view.button.HelpButton).not.to.be(undefined);
        });

        it('can be instantiated', function() {
            var inst = Ext.create('CpsiMapview.view.button.HelpButton');
            expect(inst).to.be.a(CpsiMapview.view.button.HelpButton);
        });
    });
});
