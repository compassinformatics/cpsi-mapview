Ext.Loader.syncRequire(['CpsiMapview.util.Turf']);

describe('CpsiMapview.util.Turf', function () {
    const cmp = CpsiMapview.util.Turf;

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
        let map;
        let feature;
        let coords;

        beforeEach(function () {
            map = new ol.Map();
            coords = [
                [0, 0],
                [0, 1]
            ];
            feature = new ol.Feature({
                geometry: new ol.geom.LineString(coords)
            });
        });

        it('creates a parallel feature', function () {
            const offset = 1;
            const parallelFeature = cmp.createParallelFeature(
                map,
                feature,
                offset
            );

            const parallelCoords = parallelFeature
                .getGeometry()
                .getCoordinates();
            // default unit in turf is kilometers
            const expectedCoord = coords[0][0] + 1000;

            // we have to consider rounding errors
            // but the precise number does not matter for our tests
            const roundingError = 2;
            // checking one coordinate is sufficient, as we
            // just want to make sure that the geometry is changed.
            expect(parallelCoords[0][0]).to.be.within(
                expectedCoord - roundingError,
                expectedCoord + roundingError
            );
        });

        it('considers the offset unit', function () {
            const offset = 1;
            const unit = 'meters';
            const parallelFeature = cmp.createParallelFeature(
                map,
                feature,
                offset,
                unit
            );

            const parallelCoords = parallelFeature
                .getGeometry()
                .getCoordinates();
            const expectedCoord = coords[0][0] + 1;

            // we have to consider rounding errors
            // but the precise number does not matter for our tests
            const roundingError = 2;
            // checking one coordinate is sufficient, as we
            // just want to make sure that the geometry is changed.
            expect(parallelCoords[0][0]).to.be.within(
                expectedCoord - roundingError,
                expectedCoord + roundingError
            );
        });
    });
});
