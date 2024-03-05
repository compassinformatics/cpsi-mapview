describe('CpsiMapview.view.button.SpatialQueryButton', function() {
    describe('Basics', function() {
        it('is defined', function() {
            expect(CpsiMapview.view.button.SpatialQueryButton).not.to.be(undefined);
        });

        it('can be instantiated', function() {
            var inst = Ext.create('CpsiMapview.view.button.SpatialQueryButton');
            expect(inst).to.be.a(CpsiMapview.view.button.SpatialQueryButton);
        });
    });
});
