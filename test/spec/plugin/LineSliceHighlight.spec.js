describe('CpsiMapview.plugin.LineSliceHighlight', function () {
    Ext.Loader.syncRequire(['CpsiMapview.plugin.LineSliceHighlight']);

    // a straight 1000 m East-West line in Irish Transverse Mercator
    const makeLine = function () {
        return new ol.geom.LineString([
            [714000, 729000],
            [714500, 729000],
            [715000, 729000]
        ]);
    };

    const itm = new ol.proj.Projection({
        code: 'EPSG:2157',
        units: 'm'
    });

    const makePlugin = function () {
        const plugin = new CpsiMapview.plugin.LineSliceHighlight();
        plugin.init();
        return plugin;
    };

    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.plugin.LineSliceHighlight).not.to.be(undefined);
        });

        it('can be created', function () {
            const plugin = new CpsiMapview.plugin.LineSliceHighlight();
            expect(plugin).to.not.be(undefined);
        });

        it('sets a default style on init', function () {
            const plugin = makePlugin();
            expect(plugin.style).to.not.be(null);
        });

        it('does not overwrite a configured style', function () {
            const style = new ol.style.Style({
                stroke: new ol.style.Stroke({ color: 'blue', width: 9 })
            });
            const plugin = new CpsiMapview.plugin.LineSliceHighlight({
                style: style
            });
            plugin.init();
            expect(plugin.style).to.be(style);
        });

        it('can set a style', function () {
            const plugin = makePlugin();
            const style = new ol.style.Style({
                stroke: new ol.style.Stroke({ color: 'green', width: 1 })
            });
            plugin.setStyle(style);
            expect(plugin.style).to.be(style);
        });
    });

    describe('calculateSlice', function () {
        it('measures projected geometry as planar length', function () {
            const plugin = makePlugin();
            const slice = plugin.calculateSlice(makeLine(), 0, 1000, itm);
            expect(Math.round(slice.getLength())).to.be(1000);
        });

        it('slices from the start of the line', function () {
            const plugin = makePlugin();
            const slice = plugin.calculateSlice(makeLine(), 0, 250, itm);
            expect(Math.round(slice.getLength())).to.be(250);
        });

        it('slices across a vertex', function () {
            const plugin = makePlugin();
            const slice = plugin.calculateSlice(makeLine(), 400, 600, itm);
            const coords = slice.getCoordinates();
            expect(Math.round(slice.getLength())).to.be(200);
            expect(Math.round(coords[0][0])).to.be(714400);
            expect(Math.round(coords[coords.length - 1][0])).to.be(714600);
        });

        it('slices to the end of the line', function () {
            const plugin = makePlugin();
            const slice = plugin.calculateSlice(makeLine(), 750, 1000, itm);
            expect(Math.round(slice.getLength())).to.be(250);
        });

        it('keeps the intermediate vertex in a full slice', function () {
            const plugin = makePlugin();
            const slice = plugin.calculateSlice(makeLine(), 0, 1000, itm);
            expect(slice.getCoordinates().length).to.be(3);
        });

        it('does not mutate the source geometry', function () {
            const plugin = makePlugin();
            const line = makeLine();
            const before = JSON.stringify(line.getCoordinates());
            plugin.calculateSlice(line, 100, 900, itm);
            expect(JSON.stringify(line.getCoordinates())).to.be(before);
        });

        it('handles a north-south line', function () {
            const plugin = makePlugin();
            const line = new ol.geom.LineString([
                [714000, 729000],
                [714000, 730000]
            ]);
            const slice = plugin.calculateSlice(line, 0, 1000, itm);
            expect(Math.round(slice.getLength())).to.be(1000);
        });

        it('handles a diagonal line', function () {
            const plugin = makePlugin();
            const line = new ol.geom.LineString([
                [714000, 729000],
                [714300, 729400]
            ]);
            // hypotenuse is exactly 500 m
            const slice = plugin.calculateSlice(line, 0, 500, itm);
            expect(Math.round(slice.getLength())).to.be(500);
        });
    });

    describe('removeHighlight', function () {
        it('does nothing when there is no layer', function () {
            const plugin = makePlugin();
            plugin.removeHighlight();
            expect(plugin.layer).to.be(undefined);
        });

        it('clears the layer reference', function () {
            const plugin = makePlugin();
            plugin.layer = new ol.layer.Vector({
                source: new ol.source.Vector()
            });
            plugin.removeHighlight();
            expect(plugin.layer).to.be(null);
        });
    });
});
