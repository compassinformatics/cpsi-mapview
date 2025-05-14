describe('CpsiMapview.view.toolbar.MapFooter', function () {
    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.view.toolbar.MapFooter).not.to.be(undefined);
        });

        it('can be instantiated', function () {
            const inst = Ext.create('CpsiMapview.view.toolbar.MapFooter');
            expect(inst).to.be.a(CpsiMapview.view.toolbar.MapFooter);
        });
    });
});
