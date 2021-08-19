describe('CpsiMapview.view.toolbar.MapTools', function() {
    describe('Basics', function() {
        it('is defined', function() {
            expect(CpsiMapview.view.toolbar.MapTools).not.to.be(undefined);
        });

        it('can be instantiated', function() {
            var inst = Ext.create('CpsiMapview.view.toolbar.MapTools');
            expect(inst).to.be.a(CpsiMapview.view.toolbar.MapTools);
        });
    });
});
