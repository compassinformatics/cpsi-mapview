Ext.Loader.syncRequire([
    'CpsiMapview.util.ApplicationMixin',
    'CpsiMapview.view.main.Main'
]);

describe('CpsiMapview.util.ApplicationMixin', function () {
    const mixin = CpsiMapview.util.ApplicationMixin;

    describe('Basics', function () {
        it('is defined', function () {
            expect(mixin).not.to.be(undefined);
        });
    });

    describe('Functions', function () {
        let mixin;

        beforeEach(function () {
            mixin = new CpsiMapview.util.ApplicationMixin();

            // mock the required Ext.application functions

            mixin.setMainView = Ext.emptyFn;
            mixin.control = Ext.emptyFn;
            mixin.getMainView = function () {
                return {
                    mask: Ext.emptyFn,
                    unmask: Ext.emptyFn
                };
            };
            mixin.mainViewXType = 'cmv_main'; // as it is a mixin we can't set this property in the constructor
        });

        it('#beforeInit', function () {
            // check for undefined as the method does not return a value
            expect(mixin.beforeInit()).to.be(undefined);
        });

        it('#loadAllStores', function () {
            // check for undefined as the method does not return a value
            expect(mixin.loadAllStores()).to.be(undefined);
        });

        it('#storeLoaded', function () {
            mixin.storeCounter = 1;
            mixin.storeLoaded();
            expect(mixin.storeCounter).to.be(0);
        });

        it('#loadApplication', function () {
            expect(mixin.applicationLoaded).to.be(false);
            mixin.loadApplication();
            expect(mixin.applicationLoaded).to.be(true);
        });

        it('#getSiteSettings', function () {
            Ext.create('Ext.data.ArrayStore', {
                storeId: 'test',
                fields: ['id', 'key'],
                data: [
                    [1, 'key1'],
                    [2, 'key2']
                ]
            });
            const rec = mixin.getSiteSettings('test', 'key1');
            expect(rec.get('id')).to.be(1);
        });

        it('#getUrlParameter', function () {
            const regex = /prefix\s*(.*?)\s*-postfix.mysite.ie/g;
            const hostname = 'prefixsubsite-postfix.mysite.ie';
            const value = mixin.getUrlParameter(regex, hostname);
            expect(value).to.be('subsite');
        });

        it('#doLogin', function () {
            expect(mixin.loginWindow).to.be(null);
            mixin.doLogin();
            expect(mixin.loginWindow).not.to.be(null);
        });

        it('#setupRequestHooks', function () {
            expect(mixin.setupRequestHooks()).to.be(undefined);
        });

        it('#onMapToolsToggle', function () {
            expect(mixin.onMapToolsToggle()).to.be(undefined);
        });

        it('#onApplicationCreated', function () {
            expect(mixin.onApplicationCreated()).to.be(undefined);
        });

        it('#onLogin', function () {
            expect(mixin.applicationLoaded).to.be(false);
            const loginData = {
                key: 'value'
            };
            mixin.onLogin(loginData);
            expect(mixin.applicationLoaded).to.be(true);
        });

        it('#onAjaxRequestComplete', function () {
            const response = {
                request: {
                    url: '/test'
                },
                status: 200,
                responseType: 'application/json'
            };

            const success = mixin.onAjaxRequestComplete(null, response);

            expect(success).to.be(true);
        });

        it('#getResourcePaths', function (done) {
            mixin.getResourcePaths().then(function (data) {
                expect(data).to.eql({
                    layerConfig: 'resources/data/layers/default.json',
                    treeConfig: 'resources/data/layers/tree.json'
                });
                done();
            });
        });

        it('#getResourcePaths can be overridden', function (done) {
            mixin.getResourcePaths = function () {
                return new Ext.Promise(function (resolve) {
                    resolve({
                        layerConfig: 'custom/default.json',
                        treeConfig: 'custom/tree.json'
                    });
                });
            };

            mixin.getResourcePaths().then(function (data) {
                expect(data).to.eql({
                    layerConfig: 'custom/default.json',
                    treeConfig: 'custom/tree.json'
                });
                done();
            });
        });
    });
});
