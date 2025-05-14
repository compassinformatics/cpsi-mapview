describe('CpsiMapview.view.toolbar.CircleSelectionToolbar', function () {
    describe('CircleSelectionToolbar', function () {
        it('is defined', function () {
            expect(CpsiMapview.view.toolbar.CircleSelectionToolbar).not.to.be(
                undefined
            );
        });

        it('can be instantiated', function () {
            const inst = Ext.create(
                'CpsiMapview.view.toolbar.CircleSelectionToolbar'
            );
            expect(inst).to.be.a(
                CpsiMapview.view.toolbar.CircleSelectionToolbar
            );
        });

        it('gets the radius of the current feature', function () {
            const expectedRadius = 1;
            const circle = new ol.geom.Circle([0, 0], expectedRadius);
            const feat = new ol.Feature({ geometry: circle });
            const inst = Ext.create(
                'CpsiMapview.view.toolbar.CircleSelectionToolbar',
                { feature: feat }
            );

            const radius = inst.getController().getCurrentRadius();
            expect(radius).to.be.equal(expectedRadius / 2);
        });

        it('updates the radius', function () {
            const initRadius = 1;
            const circle = new ol.geom.Circle([0, 0], initRadius);
            const feat = new ol.Feature({ geometry: circle });
            const inst = Ext.create(
                'CpsiMapview.view.toolbar.CircleSelectionToolbar',
                { feature: feat }
            );

            const changeRadius = 5;
            const contr = inst.getController();
            contr.onRadiusChange(null, changeRadius);

            const radius = inst.getController().getCurrentRadius();
            expect(radius).to.be.equal(changeRadius);
            expect(radius).not.to.be.equal(initRadius);
        });
    });
});
