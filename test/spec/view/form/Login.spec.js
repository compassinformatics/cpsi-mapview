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
                serviceUrl: '/resources/data/forms/login.json',
                tokenName: 'mytoken'
            });

            var ctrlr = inst.getController();
            ctrlr.attemptLogin();

            ctrlr.on('login', function (jsonData) {
                var token = Ext.util.Cookies.get('mytoken');
                expect(token).to.be('bfdb15be-7ec9-4956-b2b3-5b25f77d3877');
                expect(jsonData.roles.length).to.be(9);
                done();
            });

        });

    });
});
