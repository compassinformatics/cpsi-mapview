describe('CpsiMapview.view.form.Login', function () {
    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.view.form.Login).not.to.be(undefined);
        });

        it('can be instantiated', function () {
            const inst = Ext.create('CpsiMapview.view.form.Login');
            expect(inst).to.be.a(CpsiMapview.view.form.Login);
        });

        it('can call mocked service', function (done) {
            const inst = Ext.create('CpsiMapview.view.form.Login', {
                viewModel: {
                    serviceUrl: '/resources/data/forms/login.json',
                    tokenName: 'mytoken'
                }
            });

            const ctrlr = inst.getController();

            Ext.GlobalEvents.on('login', function (jsonData) {
                const token = Ext.util.Cookies.get('mytoken');
                expect(token).to.be('bfdb15be-7ec9-4956-b2b3-5b25f77d3877');
                expect(jsonData.roles.length).to.be(9);
                done();
            });

            ctrlr.attemptLogin();
        });
    });

    describe('extraLoginParams', function () {
        beforeEach(function () {
            const app = Ext.getApplication
                ? Ext.getApplication()
                : Ext.app.Application.instance;
            app.extraLoginParams = { test: true };
        });

        it('adds extraLoginParams to serviceUrl post', function () {
            const inst = Ext.create('CpsiMapview.view.form.Login', {
                viewModel: {
                    serviceUrl: '/resources/data/forms/login.json'
                }
            });
            const ctrlr = inst.getController();
            const spy = sinon.spy(ctrlr, 'callLoginService');
            ctrlr.attemptLogin();
            expect(spy.calledOnce);
            const jsonDataArg = spy.getCall(0).args[0];
            expect(JSON.parse(jsonDataArg).test).to.be(true);
        });
    });
});
