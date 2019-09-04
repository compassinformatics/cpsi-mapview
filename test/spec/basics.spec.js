describe('Basic requirements of CpsiMapview', function() {
    describe('Libraries are loaded & available in testsuite', function() {
        describe('ExtJS', function() {
            it('is defined', function() {
                expect(Ext).not.to.be(undefined);
            });
        });
        describe('OpenLayers', function() {
            it('is defined', function() {
                expect(ol).not.to.be(undefined);
            });
        });
        describe('GeoExt', function() {
            it('is defined', function() {
                expect(GeoExt).not.to.be(undefined);
            });
        });
        describe('BasiGX', function() {
            it('is defined', function() {
                expect(BasiGX).not.to.be(undefined);
            });
        });
    });
    describe('CpsiMapview app/lib is initialized', function() {
        describe('CpsiMapview Namespace', function() {
            it('is defined', function() {
                expect(CpsiMapview).not.to.be(undefined);
            });
        });
    });
});
