Ext.Loader.syncRequire([
    'CpsiMapview.util.Turf'
]);

describe('CpsiMapview.util.Turf', function () {
    var cmp = CpsiMapview.util.Turf;

    describe('Basics', function () {
        it('is defined', function () {
            expect(cmp).not.to.be(undefined);
        });
        it('turf is defined', function () {
            expect(turf).not.to.be(undefined);
        });

        it('turf.lineOffset is defined', function () {
            expect(turf.lineOffset).not.to.be(undefined);
        });
    });

    describe('#createParallelFeature', function () {

        var map;
        var feature;
        var coords;

        beforeEach(function () {
            map = new ol.Map();
            coords = [[0, 0], [0, 1]];
            feature = new ol.Feature({
                geometry: new ol.geom.LineString(coords)
            });
        });

        it('creates a parallel feature', function () {
            var offset = 1;
            var parallelFeature = cmp.createParallelFeature(map, feature, offset);

            var parallelCoords = parallelFeature.getGeometry().getCoordinates();
            // default unit in turf is kilometers
            var expectedCoord = coords[0][0] + 1000;

            // we have to consider rounding errors
            // but the precise number does not matter for our tests
            var roundingError = 2;
            // checking one coordinate is sufficient, as we
            // just want to make sure that the geometry is changed.
            expect(parallelCoords[0][0]).to.be.within(
                expectedCoord - roundingError,
                expectedCoord + roundingError
            );
        });

        it('considers the offset unit', function () {
            var offset = 1;
            var unit = 'meters';
            var parallelFeature = cmp.createParallelFeature(map, feature, offset, unit);

            var parallelCoords = parallelFeature.getGeometry().getCoordinates();
            var expectedCoord = coords[0][0] + 1;

            // we have to consider rounding errors
            // but the precise number does not matter for our tests
            var roundingError = 2;
            // checking one coordinate is sufficient, as we
            // just want to make sure that the geometry is changed.
            expect(parallelCoords[0][0]).to.be.within(
                expectedCoord - roundingError,
                expectedCoord + roundingError
            );
        });
    });
});
