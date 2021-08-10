describe('CpsiMapview.form.ControllerMixin', function () {

    it('is defined', function () {
        expect(CpsiMapview.form.ControllerMixin).not.to.be(undefined);
    });

    it('can be instantiated', function () {
        var inst = Ext.create('CpsiMapview.form.ControllerMixin');
        expect(inst).to.be.a(CpsiMapview.form.ControllerMixin);
    });

    //describe('Functions', function () {

    //    it('#onFieldChanged', function () {
    //        var fn = mixin.onFieldChanged;
    //        expect(fn).not.to.be(undefined);
    //    });
    //});
});
