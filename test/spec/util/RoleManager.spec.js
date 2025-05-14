describe('CpsiMapview.util.RoleManager', function () {
    Ext.Loader.syncRequire(['CpsiMapview.util.RoleManager']);

    const cmp = CpsiMapview.util.RoleManager;

    describe('Basics', function () {
        it('is defined', function () {
            expect(cmp).not.to.be(undefined);
        });
    });

    describe('Functions', function () {
        it('#checkRole', function () {
            const fn = cmp.checkRole;
            expect(fn).not.to.be(undefined);
        });

        it('#hasAtLeastOneRequiredRole', function () {
            const fn = cmp.hasAtLeastOneRequiredRole;
            expect(fn).not.to.be(undefined);

            // mock that user has roles: EDITOR_ROLE and VIEWER_ROLE
            CpsiMapview.util.RoleManager.checkRole = function (role) {
                return role === 'EDITOR_ROLE' || role === 'VIEWER_ROLE';
            };

            // if a single role is required
            expect(fn(['EDITOR_ROLE'])).to.equal(true);
            expect(fn(['VIEWER_ROLE'])).to.equal(true);
            expect(fn(['ADMIN_ROLE'])).to.equal(false);

            // if one of multiple roles is required
            expect(fn(['EDITOR_ROLE', 'VIEWER_ROLE', 'ADMIN_ROLE'])).to.equal(
                true
            );
            expect(fn(['EDITOR_ROLE', 'VIEWER_ROLE'])).to.equal(true);
            expect(fn(['ADMIN_ROLE', 'DUMMY_ROLE'])).to.equal(false);

            // if an empty Array is provided
            expect(fn([])).to.equal(false);
        });
    });
});
