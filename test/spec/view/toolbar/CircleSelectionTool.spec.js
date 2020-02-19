describe('CpsiMapview.view.toolbar.CircleSelection', function () {
    describe('CircleSelection', function () {
        it('is defined', function () {
            expect(CpsiMapview.view.toolbar.CircleSelection).not.to.be(undefined);
        });

        it('can be instantiated', function () {
            var inst = Ext.create('CpsiMapview.view.toolbar.CircleSelection');
            expect(inst).to.be.a(CpsiMapview.view.toolbar.CircleSelection);
        });

        it('gets the radius of the current feature', function () {
            var expectedRadius = 1;
            var circle = new ol.geom.Circle([0, 0], expectedRadius);
            var feat = new ol.Feature({ geometry: circle });
            var inst = Ext.create('CpsiMapview.view.toolbar.CircleSelection', { feature: feat });

            var radius = inst.getController().getCurrentRadius();
            expect(radius).to.be.equal(expectedRadius / 2);
        });

        it('updates the radius', function () {
            var initRadius = 1;
            var circle = new ol.geom.Circle([0, 0], initRadius);
            var feat = new ol.Feature({ geometry: circle });
            var inst = Ext.create('CpsiMapview.view.toolbar.CircleSelection', { feature: feat });

            var changeRadius = 5;
            var contr = inst.getController();
            contr.onRadiusChange(null, changeRadius);

            var radius = inst.getController().getCurrentRadius();
            expect(radius).to.be.equal(changeRadius);
            expect(radius).not.to.be.equal(initRadius);
        });


        it('sets the unit', function () {
            var inst = Ext.create('CpsiMapview.view.toolbar.CircleSelection');
            var initUnit = inst.getViewModel().data.unit;

            var map = BasiGX.util.Map.getMapComponent().map;
            // set view to projection of unit degrees
            var view = new ol.View({projection: 'EPSG:4326'});
            map.setView(view);

            inst.getController().setCurrentUnit();

            var currentUnit = inst.getViewModel().data.unit;
            expect(currentUnit).not.to.be.equal(initUnit);
            expect(currentUnit).to.be.equal('degrees');
        });
    });
});
