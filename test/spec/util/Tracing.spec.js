describe('CpsiMapview.util.Tracing', function () {

    Ext.Loader.syncRequire(['CpsiMapview.util.Tracing']);

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

        it('#lineStringPopulated', function () {
            var fn = util.lineStringPopulated;
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

    describe('#concatLineCoords', function () {
        var fn = util.concatLineCoords;
        var aLineCoords;
        var bLineCoords;

        var c = [0, 0];
        var d = [0, 1];
        var e = [1, 1];
        var f = [1, 2];
        var g = [2, 2];
        var h = [2, 3];
        var i = [3, 3];
        var j = [3, 4];
        var k = [4, 4];

        it('returns undefined on invalid input', function () {
            expect(fn(aLineCoords, bLineCoords)).to.be(undefined);
            aLineCoords = [c, d];
            bLineCoords = undefined;
            expect(fn(aLineCoords, bLineCoords)).to.be(undefined);

            aLineCoords = undefined;
            bLineCoords = [c, d];
            expect(fn(aLineCoords, bLineCoords)).to.be(undefined);

            aLineCoords = undefined;
            bLineCoords = [c];
            expect(fn(aLineCoords, bLineCoords)).to.be(undefined);

            aLineCoords = 'asdfasfd';
            bLineCoords = [c];
            expect(fn(aLineCoords, bLineCoords)).to.be(undefined);

            aLineCoords = [c];
            bLineCoords = [d];
            expect(fn(aLineCoords, bLineCoords)).to.be(undefined);
        });

        it('returns undefined on non-touching lines', function () {
            aLineCoords = [c, d];
            bLineCoords = [e, f];
            expect(fn(aLineCoords, bLineCoords)).to.be(undefined);
        });

        it('returns correct line on valid input', function () {
            var result;
            var expected = [c, d, e, f, g];

            // case: lastFirst
            result = fn([c, d, e], [e, f, g]);
            expect(Ext.Array.equals(result, expected)).to.be(true);

            // case: lastLast
            result = fn([c, d, e], [g, f, e]);
            expect(Ext.Array.equals(result, expected)).to.be(true);

            // case: firstFirst
            result = fn([e, d, c], [e, f, g]);
            expect(Ext.Array.equals(result, expected)).to.be(true);

            // case: firstLast
            result = fn([e, d, c], [g, f, e]);
            expect(Ext.Array.equals(result, expected)).to.be(true);

            // long linestrings
            result = fn([c, d, e, f, g, h], [h, i, j, k]);
            expected = [c, d, e, f, g, h, i, j, k];
            expect(Ext.Array.equals(result, expected)).to.be(true);
        });
    });

    describe('#lineStringPopulated', function () {
        var fn = util.lineStringPopulated;
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
            expect(fn(feature)).to.be(true);
        });

        it('returns undefined on valid Polygon', function () {
            feature.setGeometry(new ol.geom.Polygon([[1, 2], [3, 4], [5, 6], [1, 2]]));
            expect(fn(feature)).to.be(undefined);
        });
    });

});
