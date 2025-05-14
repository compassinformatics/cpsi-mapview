describe('CpsiMapview.view.addArcGISRest.AddArcGISRestForm', function () {
    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.view.addArcGISRest.AddArcGISRestForm).not.to.be(
                undefined
            );
        });

        it('can be instantiated', function () {
            const inst = Ext.create(
                'CpsiMapview.view.addArcGISRest.AddArcGISRestForm',
                {}
            );
            expect(inst).to.be.a(
                CpsiMapview.view.addArcGISRest.AddArcGISRestForm
            );
        });
    });
});
