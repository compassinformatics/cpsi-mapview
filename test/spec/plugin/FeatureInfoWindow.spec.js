describe('CpsiMapview.plugin.FeatureInfoWindow', function () {

    Ext.Loader.syncRequire(['CpsiMapview.plugin.FeatureInfoWindow']);

    it('is defined', function () {
        expect(CpsiMapview.plugin.FeatureInfoWindow).not.to.be(undefined);
    });

    it('can be instantiated', function () {
        var inst = Ext.create('CpsiMapview.plugin.FeatureInfoWindow');
        expect(inst).to.be.a(CpsiMapview.plugin.FeatureInfoWindow);
    });

});
