describe('CpsiMapview.util.MenuMixin', function () {
    Ext.Loader.syncRequire([
        'CpsiMapview.view.window.MinimizableWindow',
        'CpsiMapview.util.MenuMixin'
    ]);

    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.util.MenuMixin).not.to.be(undefined);
        });
    });

    describe('Functions', function () {
        it('showEditWindow duplicate record is destroyed', function () {
            const wt = 'CpsiMapview.view.window.MinimizableWindow';
            const recId = 99;

            const rec1 = {
                getId: function () {
                    return recId;
                },
                isDestroyed: false,
                destroy: function () {
                    this.isDestroyed = true;
                }
            };

            const rec2 = {
                getId: function () {
                    return recId;
                },
                isDestroyed: false,
                destroy: function () {
                    this.isDestroyed = true;
                }
            };

            Ext.create(wt, {
                viewModel: {
                    data: {
                        currentRecord: rec1
                    }
                }
            });
            const mixin = Ext.create('CpsiMapview.util.MenuMixin');
            mixin.showEditWindow(wt, rec2);
            expect(rec1.isDestroyed).to.be(false);
            expect(rec2.isDestroyed).to.be(true);
        });
    });
});
