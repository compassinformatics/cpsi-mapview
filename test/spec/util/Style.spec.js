describe('CpsiMapview.util.Style', function() {
    var styleUtil = CpsiMapview.util.Style;

    describe('Basics', function() {
        it('is defined', function() {
            expect(styleUtil).not.to.be(undefined);
        });
    });

    describe('Functions', function() {

        it('#createClusterStyle', function() {
            var fn = styleUtil.createClusterStyle;
            expect(fn).not.to.be(undefined);

            var style = fn(5);
            expect(style.getText().getText()).to.be('5');
        });
    });
});
