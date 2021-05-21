describe('CpsiMapview.util.SwitchLayer', function() {
    var cmp = CpsiMapview.util.SwitchLayer;

    describe('Basics', function() {
        it('is defined', function() {
            expect(cmp).not.to.be(undefined);
        });
    });

    describe('Constants', function() {
        it('is defined', function() {
            expect(cmp.switchStates).not.to.be(undefined);
            expect(cmp.switchStates.ABOVE_SWITCH_RESOLUTION).to.be('cmv_above_switch_resolution');
            expect(cmp.switchStates.BELOW_SWITCH_RESOLUTION).to.be('cmv_below_switch_resolution');
        });
    });

    describe('Functions', function() {

        it('#handleSwitchLayerOnResolutionChange', function() {
            var fn = cmp.handleSwitchLayerOnResolutionChange;
            expect(fn).not.to.be(undefined);
        });

        it('#checkSwitchLayersRecursively', function() {
            var fn = cmp.checkSwitchLayersRecursively;
            expect(fn).not.to.be(undefined);
        });

        it('#changeInternalLayer', function() {
            var fn = cmp.checkSwitchLayersRecursively;
            expect(fn).not.to.be(undefined);
        });

        it('#isLayerSwitchNecessary', function() {
            var fn = cmp.isLayerSwitchNecessary;
            expect(fn).not.to.be(undefined);

            expect(fn(cmp.switchStates.ABOVE_SWITCH_RESOLUTION, 1, 2)).to.be(false);
            expect(fn(cmp.switchStates.BELOW_SWITCH_RESOLUTION, 1, 2)).to.be(true);

            expect(fn(cmp.switchStates.ABOVE_SWITCH_RESOLUTION, 2, 1)).to.be(true);
            expect(fn(cmp.switchStates.BELOW_SWITCH_RESOLUTION, 2, 1)).to.be(false);

            expect(fn(cmp.switchStates.ABOVE_SWITCH_RESOLUTION, 1, 1)).to.be(false);
            expect(fn(cmp.switchStates.BELOW_SWITCH_RESOLUTION, 2, 2)).to.be(true);
        });

        it('#updateLayerTreeForSwitchLayers', function() {
            var fn = cmp.updateLayerTreeForSwitchLayers;
            expect(fn).not.to.be(undefined);
        });

    });
});
