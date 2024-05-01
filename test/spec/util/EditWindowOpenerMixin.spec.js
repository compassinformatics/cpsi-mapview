describe('CpsiMapview.util.EditWindowOpenerMixin', function () {

    Ext.Loader.syncRequire(['CpsiMapview.view.window.MinimizableWindow', 'CpsiMapview.util.EditWindowOpenerMixin']);

    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.util.EditWindowOpenerMixin).not.to.be(undefined);
        });
    });

    describe('Functions', function () {
        it('getEditingFormWindow', function () {

            var wt = 'CpsiMapview.view.window.MinimizableWindow';
            var recId = 99;
            var rec = {
                getId: function () { return recId }
            };
            var win = Ext.create(wt, {
                viewModel: {
                    data: {
                        currentRecord: rec
                    }
                }
            });
            var mixin = Ext.create('CpsiMapview.util.EditWindowOpenerMixin');
            var returnedWin = mixin.getEditingFormWindow(rec, wt);
            expect(returnedWin.id).to.be(win.id);
        });
    });
});
