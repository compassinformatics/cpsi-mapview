describe('CpsiMapview.util.Tracing', function () {
    var util = CpsiMapview.util.Tracing;

    describe('Basics', function () {
        it('is defined', function () {
            expect(util).not.to.be(undefined);
        });
    });

    describe('Functions', function () {

        it('#computeModulo', function () {
            var fn = util.computeModulo;
            expect(fn).not.to.be(undefined);
        });

        it('#lineStringNotEmpty', function () {
            var fn = util.lineStringNotEmpty;
            expect(fn).not.to.be(undefined);
        });

        it('#getCoordIndex', function () {
            var fn = util.getCoordIndex;
            expect(fn).not.to.be(undefined);
        });

        it('#linesTouchAtStartEndPoint', function () {
            var fn = util.linesTouchAtStartEndPoint;
            expect(fn).not.to.be(undefined);
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

        it('#getClosestCoordinateToPoint', function () {
            var fn = util.getClosestCoordinateToPoint;
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
});
