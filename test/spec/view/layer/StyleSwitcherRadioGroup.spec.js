describe('CpsiMapview.view.layer.StyleSwitcherRadioGroup', function() {
    describe('Basics', function() {
        it('is defined', function() {
            expect(CpsiMapview.view.layer.StyleSwitcherRadioGroup).not.to.be(undefined);
        });

        it('can be instantiated', function() {
            var inst = Ext.create('CpsiMapview.view.layer.StyleSwitcherRadioGroup', {
                layer: new ol.layer.Vector()
            });
            expect(inst).to.be.a(CpsiMapview.view.layer.StyleSwitcherRadioGroup);
        });
    });
});
