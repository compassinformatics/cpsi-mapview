describe('CpsiMapview.view.toolbar.MinimizedWindows', function() {
    describe('Basics', function() {
        it('is defined', function() {
            expect(CpsiMapview.view.toolbar.MinimizedWindows).not.to.be(undefined);
        });

        it('can be instantiated', function() {
            var inst = Ext.create('CpsiMapview.view.toolbar.MinimizedWindows');
            expect(inst).to.be.a(CpsiMapview.view.toolbar.MinimizedWindows);
        });
    });
});
