describe('CpsiMapview.plugin.TreeColumnStyleSwitcher', function () {
    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.plugin.TreeColumnStyleSwitcher).not.to.be(
                undefined
            );
        });

        it('can be instantiated', function () {
            const inst = Ext.create(
                'CpsiMapview.plugin.TreeColumnStyleSwitcher',
                {}
            );
            expect(inst).to.be.a(CpsiMapview.plugin.TreeColumnStyleSwitcher);
        });
    });
});
