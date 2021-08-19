describe('CpsiMapview.controller.button.LoginButtonController', function() {
    describe('Basics', function() {
        it('is defined', function() {
            expect(CpsiMapview.controller.button.LoginButtonController).not.to.be(undefined);
        });

        it('can be created', function() {
            var ctrl = new CpsiMapview.controller.button.LoginButtonController();
            expect(ctrl).to.not.be(undefined);
        });

        it('can get login details', function () {
            var ctrl = new CpsiMapview.controller.button.LoginButtonController();

            Ext.util.Cookies.set('username', 'test');
            Ext.util.Cookies.set('roles', 'Browser_Role1,Browser_Role2');

            var text = ctrl.getLoginDetails();
            expect(text).to.be('Username: <b>test</b><br />User Roles: <br /><br />Role1<br />Role2');
        });

        it('can call onClick which clears login cookie', function () {
            var ctrl = new CpsiMapview.controller.button.LoginButtonController();

            Ext.util.Cookies.set('username', 'test');
            Ext.util.Cookies.set('roles', 'Browser_Role1,Browser_Role2');

            var text = ctrl.onClick();
            expect(Ext.util.Cookies.get('username')).to.be('');
            expect(Ext.util.Cookies.get('roles')).to.be('');
        });
    });
});
