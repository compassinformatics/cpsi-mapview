describe('CpsiMapview.controller.MapController', function() {
    describe('Basics', function() {
        it('is defined', function() {
            expect(CpsiMapview.controller.MapController).not.to.be(undefined);
        });

        it('can be created', function() {
            var ctrl = new CpsiMapview.controller.MapController();
            expect(ctrl).to.not.be(undefined);
        });
    });
});
