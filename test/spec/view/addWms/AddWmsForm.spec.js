describe('CpsiMapview.view.addWms.AddWmsForm', function() {
    describe('Basics', function() {
        it('is defined', function() {
            expect(CpsiMapview.view.addWms.AddWmsForm).not.to.be(undefined);
        });

        it('can be instantiated', function() {
            var inst = Ext.create('CpsiMapview.view.addWms.AddWmsForm', {});
            expect(inst).to.be.a(CpsiMapview.view.addWms.AddWmsForm);
        });

    });
});
