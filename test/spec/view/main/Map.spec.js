describe('CpsiMapview.view.main.Map', function() {
    describe('Basics', function() {
        it('is defined', function() {
            expect(CpsiMapview.view.main.Map).not.to.be(undefined);
        });

        it('can be instantiated', function() {
            var inst = Ext.create('CpsiMapview.view.main.Map', {});
            expect(inst).to.be.a(CpsiMapview.view.main.Map);
        });
    });
});
