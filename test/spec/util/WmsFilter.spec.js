describe('CpsiMapview.util.WmsFilter', function() {
    var cmp = CpsiMapview.util.WmsFilter;

    describe('Basics', function() {
        it('is defined', function() {
            expect(cmp).not.to.be(undefined);
        });
    });

    describe('#getWmsFilterString', function () {

        var lyr = new ol.layer.Image({
            source: new ol.source.ImageWMS()
        });

        var params = lyr.getSource().getParams();
        params.FILTER = '<Filter><fes:PropertyIsEqualTo><fes:ValueReference>IsStream</fes:ValueReference>' +
            '<fes:Literal>true</fes:Literal></fes:PropertyIsEqualTo></Filter>';

        var res = CpsiMapview.util.WmsFilter.getWmsFilterString(layer);
        var exp = '(<Filter><fes:PropertyIsEqualTo><fes:ValueReference>IsStream</fes:ValueReference><fes:Literal>true</fes:Literal></fes:PropertyIsEqualTo></Filter>)';
        expect(res).to.be(exp);
    });

    describe('#getWmsParams', function () {

        var lyr = new ol.layer.Image({
            isWms: true,
            source: new ol.source.ImageWMS({
                'SERVICE': 'WMS',
                'TRANSPARENT': true
            })
        });

        var params = CpsiMapview.util.WmsFilter.getParams(lyr);
        expect(params.SERVICE).to.be('WMS');
        expect(params.TRANSPARENT).to.be(true);
    });

    describe('#getWmsParams (MVT)', function () {

        var lyr = new ol.layer.VectorTile({
            isVt: true,
            source: new ol.source.Vector({
                url: '/mapserver/?FORMAT=mvt&WIDTH={width}'
            })
        });

        var params = CpsiMapview.util.WmsFilter.getParams(lyr);
        expect(params.FORMAT).to.be('mvt');
        expect(params.WIDTH).to.be('{width}');
    });

});
