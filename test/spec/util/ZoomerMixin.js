describe('CpsiMapview.util.ZoomerMixin', function () {
    Ext.Loader.syncRequire(['CpsiMapview.util.ZoomerMixin']);

    const cmp = CpsiMapview.util.ZoomerMixin;

    describe('Basics', function () {
        it('is defined', function () {
            expect(cmp).not.to.be(undefined);
        });
    });
});
