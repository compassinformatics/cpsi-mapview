describe('CpsiMapview.util.SwitchLayer', function () {
    const cmp = CpsiMapview.util.SwitchLayer;

    describe('Basics', function () {
        it('is defined', function () {
            expect(cmp).not.to.be(undefined);
        });
    });

    describe('Constants', function () {
        it('is defined', function () {
            expect(cmp.switchStates).not.to.be(undefined);
            expect(cmp.switchStates.ABOVE_SWITCH_RESOLUTION).to.be(
                'cmv_above_switch_resolution'
            );
            expect(cmp.switchStates.BELOW_SWITCH_RESOLUTION).to.be(
                'cmv_below_switch_resolution'
            );
        });
    });

    describe('Functions', function () {
        it('#handleSwitchLayerOnResolutionChange', function () {
            const fn = cmp.handleSwitchLayerOnResolutionChange;
            expect(fn).not.to.be(undefined);
        });

        it('#checkSwitchLayersRecursively', function () {
            const fn = cmp.checkSwitchLayersRecursively;
            expect(fn).not.to.be(undefined);
        });

        it('#changeInternalLayer', function () {
            const fn = cmp.checkSwitchLayersRecursively;
            expect(fn).not.to.be(undefined);
        });

        it('#isLayerSwitchNecessary', function () {
            const fn = cmp.isLayerSwitchNecessary;
            expect(fn).not.to.be(undefined);

            expect(fn(cmp.switchStates.ABOVE_SWITCH_RESOLUTION, 1, 2)).to.be(
                false
            );
            expect(fn(cmp.switchStates.BELOW_SWITCH_RESOLUTION, 1, 2)).to.be(
                true
            );

            expect(fn(cmp.switchStates.ABOVE_SWITCH_RESOLUTION, 2, 1)).to.be(
                true
            );
            expect(fn(cmp.switchStates.BELOW_SWITCH_RESOLUTION, 2, 1)).to.be(
                false
            );

            expect(fn(cmp.switchStates.ABOVE_SWITCH_RESOLUTION, 1, 1)).to.be(
                false
            );
            expect(fn(cmp.switchStates.BELOW_SWITCH_RESOLUTION, 2, 2)).to.be(
                true
            );
        });

        it('#updateLayerTreeForSwitchLayers', function () {
            const fn = cmp.updateLayerTreeForSwitchLayers;
            expect(fn).not.to.be(undefined);
        });

        it('#getActiveLabelStyleName', function () {
            const fn = cmp.getActiveLabelStyleName;
            expect(fn).not.to.be(undefined);

            const layerWithActiveLabelName = new ol.layer.Image({
                source: new ol.source.ImageWMS()
            });

            layerWithActiveLabelName.set('activeLabelName', 'LabelsRoads');
            layerWithActiveLabelName.set('labelClassName', 'OtherLabels');

            expect(fn(layerWithActiveLabelName)).to.be('LabelsRoads');

            const layerWithLabelClassNameOnly = new ol.layer.Image({
                source: new ol.source.ImageWMS()
            });
            layerWithLabelClassNameOnly.set('labelClassName', 'OtherLabels');
            expect(fn(layerWithLabelClassNameOnly)).to.be('OtherLabels');

            const layerWithNoLabelConfig = new ol.layer.Image({
                source: new ol.source.ImageWMS()
            });
            expect(fn(layerWithNoLabelConfig)).to.be(null);
        });

        it('#buildWmsStyleList', function () {
            const fn = cmp.buildWmsStyleList;
            expect(fn).not.to.be(undefined);

            expect(fn('DefaultStyle', true, 'LabelsRoads')).to.be(
                'DefaultStyle,LabelsRoads'
            );
            expect(fn('DefaultStyle', false, 'LabelsRoads')).to.be(
                'DefaultStyle'
            );
            expect(fn('DefaultStyle', true, null)).to.be('DefaultStyle');
        });
    });
});
