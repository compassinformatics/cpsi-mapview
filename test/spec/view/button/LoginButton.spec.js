describe('CpsiMapview.view.button.LoginButton', function () {
    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.view.button.LoginButton).not.to.be(undefined);
        });

        it('can be instantiated', function () {
            const inst = Ext.create('CpsiMapview.view.button.LoginButton');
            expect(inst).to.be.a(CpsiMapview.view.button.LoginButton);
        });
    });
});
