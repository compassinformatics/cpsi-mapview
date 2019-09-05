describe('CpsiMapview.view.combo.Gazetteer', function() {
    describe('Basics', function() {
        it('is defined', function() {
            expect(CpsiMapview.view.combo.Gazetteer).not.to.be(undefined);
        });

        it('can be instantiated', function() {
            var inst = Ext.create('CpsiMapview.view.combo.Gazetteer', {});
            expect(inst).to.be.a(CpsiMapview.view.combo.Gazetteer);
        });
    });
});
