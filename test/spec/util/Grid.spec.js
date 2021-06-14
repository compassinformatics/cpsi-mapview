describe('CpsiMapview.util.Grid', function() {
    var cmp = CpsiMapview.util.Grid;

    describe('Basics', function() {
        it('is defined', function() {
            expect(cmp).not.to.be(undefined);
        });
    });

    describe('Functions', function() {

        it('#getGridWindow', function() {
            var fn = cmp.getGridWindow;
            expect(fn).not.to.be(undefined);
        });

        it('#createGridWindow', function() {
            var fn = cmp.createGridWindow;
            expect(fn).not.to.be(undefined);
        });
    });
});
