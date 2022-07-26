describe('CpsiMapview.util.RoleManager', function () {
    var cmp = CpsiMapview.util.RoleManager;

    describe('Basics', function () {
        it('is defined', function () {
            expect(cmp).not.to.be(undefined);
        });
    });

    describe('Functions', function () {

        it('#checkRole', function () {
            var fn = cmp.checkRole;
            expect(fn).not.to.be(undefined);
        });

        it('#hasAtLeastOneRequiredRole', function () {
            var fn = cmp.hasAtLeastOneRequiredRole;
            expect(fn).not.to.be(undefined);
        });
    });
}
);
