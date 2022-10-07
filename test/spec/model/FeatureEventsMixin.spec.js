describe('CpsiMapview.model.FeatureEventsMixin', function () {

    var map;
    var layer1;
    var layer2;
    var layer3;
    var getLayersByStub;

    beforeEach(function () {

        map = new ol.Map();

        layer1 = new ol.layer.Vector({
            layerKey: 'MYKEY'
        });

        layer2 = new ol.layer.Vector({
            layerKey: 'MYKEY_WFS'
        });

        layer3 = new ol.layer.Vector({
            layerKey: 'MYKEY_WMS'
        });

        // stub BasiGX.util.Layer.getLayersBy to return test data during these tests
        getLayersByStub = sinon.stub(BasiGX.util.Layer, 'getLayersBy').callsFake(function (prop, key) {
            switch (key) {
                case 'MYKEY':
                    return [layer1]
                case 'MYKEY_WFS':
                    return [layer2]
                case 'MYKEY_WMS':
                    // test for when a switch layer is used and the WMS layer has not yet been loaded
                    return []
            }
        });
    });

    afterEach(function () {
        getLayersByStub.restore();
    });

    it('is defined', function () {
        expect(CpsiMapview.model.FeatureEventsMixin).not.to.be(undefined);
    });

    it('run model saved', function () {

        var mixin = Ext.create('CpsiMapview.model.FeatureEventsMixin', {
            syncLayerKeys: ['MYKEY', 'MYKEY_WFS', 'MYKEY_WMS']
        });

        // avoid throwing an error as fireEvent needs to be triggered when the mixin is part of a class
        mixin.hasListeners = {};

        mixin.onModelSaved();

        // the above function has no return value for testing
        expect(mixin).not.to.be(undefined);
    });

});
