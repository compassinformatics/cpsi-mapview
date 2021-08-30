describe('CpsiMapview.view.button.SplitByClickButton', function() {
    describe('Basics', function() {
        it('is defined', function() {
            expect(CpsiMapview.view.button.SplitByClickButton).not.to.be(undefined);
        });

        it('can be instantiated', function() {
            var inst = Ext.create('CpsiMapview.view.button.SplitByClickButton');
            expect(inst).to.be.a(CpsiMapview.view.button.SplitByClickButton);
        });
    });
});
