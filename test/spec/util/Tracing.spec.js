describe('CpsiMapview.util.Tracing', function () {
    Ext.Loader.syncRequire(['CpsiMapview.util.Tracing']);

    const util = CpsiMapview.util.Tracing;

    describe('Basics', function () {
        it('is defined', function () {
            expect(util).not.to.be(undefined);
        });
    });

    describe('Functions Basics', function () {
        it('#computeModulo', function () {
            const fn = util.computeModulo;
            expect(fn).not.to.be(undefined);
        });

        it('#lineStringPopulated', function () {
            const fn = util.lineStringPopulated;
            expect(fn).not.to.be(undefined);
        });

        it('#linesTouchAtStartEndPoint', function () {
            const fn = util.linesTouchAtStartEndPoint;
            expect(fn).not.to.be(false);
        });

        it('#lineInteriorTouchesLineStartEnd', function () {
            const fn = util.lineInteriorTouchesLineStartEnd;
            expect(fn).not.to.be(undefined);
        });

        it('#lineStartEndTouchesLineInterior', function () {
            const fn = util.lineStartEndTouchesLineInterior;
            expect(fn).not.to.be(undefined);
        });

        it('#computeLength', function () {
            const fn = util.computeLength;
            expect(fn).not.to.be(undefined);
        });

        it('#coordIsOnSegment', function () {
            const fn = util.coordIsOnSegment;
            expect(fn).not.to.be(undefined);
        });

        it('#concatLineCoords', function () {
            const fn = util.concatLineCoords;
            expect(fn).not.to.be(undefined);
        });

        it('#getPartialSegmentCoords', function () {
            const fn = util.getPartialSegmentCoords;
            expect(fn).not.to.be(undefined);
        });
    });

    describe('#concatLineCoords', function () {
        const fn = util.concatLineCoords;
        let aLineCoords;
        let bLineCoords;

        const c = [0, 0];
        const d = [0, 1];
        const e = [1, 1];
        const f = [1, 2];
        const g = [2, 2];
        const h = [2, 3];
        const i = [3, 3];
        const j = [3, 4];
        const k = [4, 4];

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
            let result;
            let expected = [c, d, e, f, g];

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
        const fn = util.lineStringPopulated;
        const feature = new ol.Feature({});
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
            feature.setGeometry(
                new ol.geom.LineString([
                    [1, 2],
                    [3, 4]
                ])
            );
            expect(fn(feature)).to.be(true);
        });

        it('returns undefined on valid Polygon', function () {
            feature.setGeometry(
                new ol.geom.Polygon([
                    [1, 2],
                    [3, 4],
                    [5, 6],
                    [1, 2]
                ])
            );
            expect(fn(feature)).to.be(undefined);
        });
    });
});
