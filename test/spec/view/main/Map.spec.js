describe('CpsiMapview.view.main.Map', function () {
    before(function () {
        const app = Ext.getApplication
            ? Ext.getApplication()
            : Ext.app.Application.instance;
        app.getResourcePaths = function () {
            return new Ext.Promise(function (resolve) {
                resolve({
                    layerConfig: 'resources/data/layers/default.json',
                    treeConfig: 'resources/data/layers/tree.json'
                });
            });
        };
    });

    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.view.main.Map).not.to.be(undefined);
        });

        it('can be instantiated', function () {
            const inst = Ext.create('CpsiMapview.view.main.Map', {});
            expect(inst).to.be.a(CpsiMapview.view.main.Map);
        });
    });
});
