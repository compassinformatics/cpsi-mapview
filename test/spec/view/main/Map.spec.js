describe('CpsiMapview.view.main.Map', function() {

    before(function () {
        var app = Ext.getApplication ? Ext.getApplication() : Ext.app.Application.instance;
        app.resourcePathsDeferred = new Ext.Deferred();
        app.resourcePathsDeferred.resolve({
            layerConfig: 'resources/data/layers/default.json',
            treeConfig: 'resources/data/layers/tree.json'
        });
    });


    describe('Basics', function() {
        it('is defined', function() {
            expect(CpsiMapview.view.main.Map).not.to.be(undefined);
        });

        it('can be instantiated', function() {
            var inst = Ext.create('CpsiMapview.view.main.Map', {});
            expect(inst).to.be.a(CpsiMapview.view.main.Map);
        });
    });
});
