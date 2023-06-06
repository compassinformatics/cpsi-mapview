describe('CpsiMapview.view.form.Login', function() {
    describe('Basics', function() {
        it('is defined', function() {
            expect(CpsiMapview.view.form.Login).not.to.be(undefined);
        });

        it('can be instantiated', function() {
            var inst = Ext.create('CpsiMapview.view.form.Login');
            expect(inst).to.be.a(CpsiMapview.view.form.Login);
        });

        it('can call mocked service', function (done) {
            var inst = Ext.create('CpsiMapview.view.form.Login', {
                viewModel: {
                    serviceUrl: '/resources/data/forms/login.json',
                    tokenName: 'mytoken'
                }
            });

            var ctrlr = inst.getController();

            Ext.GlobalEvents.on('login', function (jsonData) {
                var token = Ext.util.Cookies.get('mytoken');
                expect(token).to.be('bfdb15be-7ec9-4956-b2b3-5b25f77d3877');
                expect(jsonData.roles.length).to.be(9);
                done();
            });

            ctrlr.attemptLogin();
        });

    });

    describe('extraLoginParams', function() {
        before(function () {
            var app = Ext.getApplication ? Ext.getApplication() : Ext.app.Application.instance;
            app.extraLoginParams = { test: true };
        });

        it('adds extraLoginParams to serviceUrl post', function () {
            var inst = Ext.create('CpsiMapview.view.form.Login', {
                viewModel: {
                    serviceUrl: '/resources/data/forms/login.json'
                }
            });
            var ctrlr = inst.getController();
            var spy = sinon.spy(ctrlr, 'callLoginService');
            ctrlr.attemptLogin();
            expect(spy.calledOnce);
            var jsonDataArg = spy.getCall(0).args[0];
            expect(JSON.parse(jsonDataArg).test).to.be(true);
        });
    });
});
