describe('CpsiMapview.view.toolbar.ParallelLine', function() {
    describe('Basics', function() {
        it('is defined', function() {
            expect(CpsiMapview.view.toolbar.ParallelLine).not.to.be(undefined);
        });

        it('can be instantiated', function() {
            var inst = Ext.create('CpsiMapview.view.toolbar.ParallelLine');
            expect(inst).to.be.a(CpsiMapview.view.toolbar.ParallelLine);
        });
    });
});
