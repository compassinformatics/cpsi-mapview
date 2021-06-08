describe('CpsiMapview.controller.grid.Grid', function() {
    describe('Basics', function() {
        it('is defined', function() {
            expect(CpsiMapview.controller.grid.Grid).not.to.be(undefined);
        });

        it('can be created', function() {
            var ctrl = new CpsiMapview.controller.grid.Grid();
            expect(ctrl).to.not.be(undefined);
        });
    });
});
