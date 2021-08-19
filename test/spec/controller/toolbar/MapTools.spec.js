describe('CpsiMapview.controller.toolbar.MapTools', function() {
    describe('Basics', function() {
        it('is defined', function() {
            expect(CpsiMapview.controller.toolbar.MapTools).not.to.be(undefined);
        });

        it('can be created', function() {
            var ctrl = new CpsiMapview.controller.toolbar.MapTools();
            expect(ctrl).to.not.be(undefined);
        });
    });
});
