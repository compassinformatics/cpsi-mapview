describe('CpsiMapview.util.EditWindowOpenerMixin', function () {
    Ext.Loader.syncRequire([
        'CpsiMapview.view.window.MinimizableWindow',
        'CpsiMapview.util.EditWindowOpenerMixin'
    ]);

    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.util.EditWindowOpenerMixin).not.to.be(undefined);
        });
    });

    describe('Functions', function () {
        it('getEditingFormWindow', function () {
            const wt = 'CpsiMapview.view.window.MinimizableWindow';
            const recId = 99;
            const rec = {
                getId: function () {
                    return recId;
                }
            };
            const win = Ext.create(wt, {
                viewModel: {
                    data: {
                        currentRecord: rec
                    }
                }
            });
            const mixin = Ext.create('CpsiMapview.util.EditWindowOpenerMixin');
            const returnedWin = mixin.getEditingFormWindow(rec, wt);
            expect(returnedWin.id).to.be(win.id);
        });
    });
});
