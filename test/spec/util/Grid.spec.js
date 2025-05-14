describe('CpsiMapview.util.Grid', function () {
    Ext.Loader.syncRequire(['CpsiMapview.util.Grid']);

    const cmp = CpsiMapview.util.Grid;

    describe('Basics', function () {
        it('is defined', function () {
            expect(cmp).not.to.be(undefined);
        });
    });

    describe('Functions', function () {
        it('#getGridWindow', function () {
            const fn = cmp.getGridWindow;
            expect(fn).not.to.be(undefined);
        });

        it('#createGridWindow', function () {
            const fn = cmp.createGridWindow;
            expect(fn).not.to.be(undefined);
        });
    });
});
