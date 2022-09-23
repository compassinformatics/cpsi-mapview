describe('CpsiMapview.view.toolbar.ParallelLineToolbar', function() {
    describe('Basics', function() {
        it('is defined', function() {
            expect(CpsiMapview.view.toolbar.ParallelLineToolbar).not.to.be(undefined);
        });

        it('can be instantiated', function() {
            var inst = Ext.create('CpsiMapview.view.toolbar.ParallelLineToolbar');
            expect(inst).to.be.a(CpsiMapview.view.toolbar.ParallelLineToolbar);
        });
    });
});
