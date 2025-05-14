describe('CpsiMapview.util.WmsFilter', function () {
    const cmp = CpsiMapview.util.WmsFilter;

    describe('Basics', function () {
        it('is defined', function () {
            expect(cmp).not.to.be(undefined);
        });
    });

    describe('#getWmsFilterString', function () {
        const lyr = new ol.layer.Image({
            source: new ol.source.ImageWMS()
        });

        const params = lyr.getSource().getParams();
        params.LAYERS = 'MyLayer';
        params.FILTER =
            '<Filter><fes:PropertyIsEqualTo><fes:ValueReference>MyValue</fes:ValueReference>' +
            '<fes:Literal>true</fes:Literal></fes:PropertyIsEqualTo></Filter>';

        const res = CpsiMapview.util.WmsFilter.getWmsFilterString(params);
        const exp =
            '(<Filter><fes:PropertyIsEqualTo><fes:ValueReference>MyValue</fes:ValueReference><fes:Literal>true</fes:Literal></fes:PropertyIsEqualTo></Filter>)';
        expect(res).to.be(exp);
    });

    describe('#getWmsParams', function () {
        const lyr = new ol.layer.Image({
            isWms: true,
            source: new ol.source.ImageWMS({
                params: {
                    SERVICE: 'WMS',
                    TRANSPARENT: true
                }
            })
        });

        const params = CpsiMapview.util.WmsFilter.getWmsParams(lyr);
        expect(params.SERVICE).to.be('WMS');
        expect(params.TRANSPARENT).to.be(true);
    });

    describe('#getWmsParams (MVT)', function () {
        const lyr = new ol.layer.VectorTile({
            isVt: true,
            source: new ol.source.VectorTile({
                format: 'mvt',
                url: '/mapserver/?FORMAT=mvt&WIDTH={width}'
            })
        });

        const params = CpsiMapview.util.WmsFilter.getWmsParams(lyr);
        expect(params.FORMAT).to.be('mvt');
        expect(params.WIDTH).to.be('{width}');
    });
});
