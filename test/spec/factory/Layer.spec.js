describe('CpsiMapview.factory.Layer', function () {
    
    Ext.Loader.syncRequire(['CpsiMapview.factory.Layer']);

    var layerFactory = CpsiMapview.factory.Layer;

    describe('buildRequiredPropertyNames', function () {

        it('should merge and clean property names in both arguments into a unique array', function () {
            var currentPropertyNames = ['Prop1', 'Prop2', 'Prop3', ''];
            var tooltipConfig = [{
                alias: 'Name',
                property: 'Prop1'
            }, {
                alias: 'Name',
                property: 'Prop4'
            }];
            var propertyNames = layerFactory.buildRequiredPropertyNames(currentPropertyNames, tooltipConfig);
            expect(propertyNames).to.eql(['Prop1', 'Prop2', 'Prop3', 'Prop4']);

        });

    });

    describe('getPropertyNamesInSLD', function () {

        it('should extract PropertName values from an SLD', function (done) {
            Ext.Ajax.request({
                url: '/resources/style/style1.xml',
                success: function (response) {
                    var propertyNames = layerFactory.getPropertyNamesInSLD(response.responseXML);
                    expect(propertyNames).to.eql(['EdgeId', 'FID']);
                    done();
                }
            });
        });

    });
});
