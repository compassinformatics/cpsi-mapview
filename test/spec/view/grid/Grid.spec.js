describe('CpsiMapview.view.grid.Grid', function() {
    describe('Basics', function() {
        it('is defined', function() {
            expect(CpsiMapview.view.grid.Grid).not.to.be(undefined);
        });

        it('can be instantiated', function() {
            var inst = Ext.create('CpsiMapview.view.grid.Grid');
            expect(inst).to.be.a(CpsiMapview.view.grid.Grid);
        });

    });
});
