describe('CpsiMapview.util.Layer', function () {
    var layerUtil = CpsiMapview.util.Layer;

    describe('Basics', function () {
        it('is defined', function () {
            expect(layerUtil).not.to.be(undefined);
        });
    });

    describe('Refresh functions', function () {

        it('#layerRefresh WMS', function () {

            var lyr = new ol.layer.Image({
                source: new ol.source.ImageWMS({
                    isWfs: true
                })
            });

            var params = lyr.getSource().getParams();

            expect(params.TIMESTAMP).to.be(undefined);
            layerUtil.layerRefresh(lyr);
            expect(params.TIMESTAMP).not.to.be(undefined);
        });

        it('#layerRefresh WFS', function () {

            var lyr = new ol.layer.Vector({
                isWfs: true,
                source: new ol.source.Vector()
            });

            var src = lyr.getSource();

            expect(src.get('timestamp')).to.be(undefined);
            layerUtil.layerRefresh(lyr);
            expect(src.get('timestamp')).not.to.be(undefined);
        });

        it('#layerRefresh clustered WFS', function () {

            var lyr = new ol.layer.Vector({
                isWfs: true,
                source: new ol.source.Cluster({
                    source: new ol.source.Vector()
                })
            });

            var src = lyr.getSource().getSource();

            expect(src.get('timestamp')).to.be(undefined);
            layerUtil.layerRefresh(lyr);
            expect(src.get('timestamp')).not.to.be(undefined);
        });

    });

    describe('Filter functions', function () {
        var source, spatialFilter, fidFilter, propertyFilter;

        beforeEach(function () {
            source = new ol.source.Vector();

            var coords = [[16, 48], [19, 9]];
            var geometry = new ol.geom.LineString(coords);
            var epsg = 'EPSG:4326';

            spatialFilter = GeoExt.util.OGCFilter.createSpatialFilter('intersect', 'the_geom', geometry, epsg);

            fidFilter = new Ext.util.Filter({
                type: 'fid',
                property: 'myProperty',
                value: [1, 2],
                operator: 'in'
            });

            propertyFilter = new Ext.util.Filter({
                property: 'myProperty2',
                value: [3],
                operator: 'in'
            });

        });

        it('#layerFilter spatial', function () {

            source.set('additionalFilters', [spatialFilter]);
            var ogcFilters = layerUtil.filterVectorSource(source);

            expect(ogcFilters.length).to.be(1);

            var exp = '<fes:Intersects><fes:ValueReference>the_geom</fes:ValueReference><gml:LineString gml:id="L1" ' +
                'srsName="urn:ogc:def:crs:EPSG:4326" srsDimension="2"><gml:posList>16 48 19 9</gml:posList></gml:LineString></fes:Intersects>';

            expect(ogcFilters[0]).to.be(exp);
        });

        it('#layerFilter fids', function () {

            source.set('additionalFilters', [fidFilter]);
            var ogcFilters = layerUtil.filterVectorSource(source);

            expect(ogcFilters.length).to.be(1);

            var exp = '<fes:Or><fes:PropertyIsEqualTo><fes:ValueReference>myProperty</fes:ValueReference><fes:Literal>1</fes:Literal>' +
                '</fes:PropertyIsEqualTo><fes:PropertyIsEqualTo><fes:ValueReference>myProperty</fes:ValueReference><fes:Literal>2</fes:Literal>' +
                '</fes:PropertyIsEqualTo></fes:Or>';
            expect(ogcFilters[0]).to.be(exp);
        });

        it('#layerFilter combined grid filters', function () {

            source.set('additionalFilters', [spatialFilter, fidFilter]);
            var ogcFilters = layerUtil.filterVectorSource(source);

            expect(ogcFilters.length).to.be(1);
        });

        it('#layerFilter combined all filters', function () {

            source.set('additionalFilters', [spatialFilter, fidFilter, propertyFilter]);
            var ogcFilters = layerUtil.filterVectorSource(source);

            expect(ogcFilters.length).to.be(2);
            expect(source.get('additionalFilters').length).to.be(3); // original filter array should remain unmodified
        });
    });
});
