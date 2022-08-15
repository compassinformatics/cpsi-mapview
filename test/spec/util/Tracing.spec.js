describe('CpsiMapview.util.Tracing', function () {
    var util = CpsiMapview.util.Tracing;

    describe('Basics', function () {
        it('is defined', function () {
            expect(util).not.to.be(undefined);
        });
    });

    describe('Functions Basics', function () {

        it('#computeModulo', function () {
            var fn = util.computeModulo;
            expect(fn).not.to.be(undefined);
        });

        it('#lineStringNotEmpty', function () {
            var fn = util.lineStringNotEmpty;
            expect(fn).not.to.be(undefined);
        });

        it('#linesTouchAtStartEndPoint', function () {
            var fn = util.linesTouchAtStartEndPoint;
            expect(fn).not.to.be(false);
        });

        it('#lineInteriorTouchesLineStartEnd', function () {
            var fn = util.lineInteriorTouchesLineStartEnd;
            expect(fn).not.to.be(undefined);
        });

        it('#lineStartEndTouchesLineInterior', function () {
            var fn = util.lineStartEndTouchesLineInterior;
            expect(fn).not.to.be(undefined);
        });

        it('#computeLength', function () {
            var fn = util.computeLength;
            expect(fn).not.to.be(undefined);
        });

        it('#coordIsOnSegment', function () {
            var fn = util.coordIsOnSegment;
            expect(fn).not.to.be(undefined);
        });

        it('#concatLineCoords', function () {
            var fn = util.concatLineCoords;
            expect(fn).not.to.be(undefined);
        });

        it('#getPartialSegmentCoords', function () {
            var fn = util.getPartialSegmentCoords;
            expect(fn).not.to.be(undefined);
        });
    });

    describe('#lineStringNotEmpty', function () {
        var fn = util.lineStringNotEmpty;
        var feature = new ol.Feature({});
        it('returns undefined on empty feature', function () {
            expect(fn(feature)).to.be(undefined);
        });

        it('returns false on empty String', function () {
            feature.setGeometry(new ol.geom.LineString([]));
            expect(fn(feature)).to.be(false);
        });

        it('returns false on invalid LineString', function () {
            feature.setGeometry(new ol.geom.LineString([[1, 2]]));
            expect(fn(feature)).to.be(false);
        });

        it('returns true on valid LineString', function () {
            feature.setGeometry(new ol.geom.LineString([[1, 2], [3, 4]]));
            console.log(fn(feature));
            expect(fn(feature)).to.be(true);
        });

        it('returns undefined on valid Polygon', function () {
            feature.setGeometry(new ol.geom.Polygon([[1, 2], [3, 4], [5, 6], [1, 2]]));
            expect(fn(feature)).to.be(undefined);
        });
    });

});
