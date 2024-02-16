describe('CpsiMapview.controller.grid.Grid', function () {

    Ext.Loader.syncRequire(['CpsiMapview.controller.grid.Grid']);

    describe('Basics', function() {
        it('is defined', function() {
            expect(CpsiMapview.controller.grid.Grid).not.to.be(undefined);
        });

        it('can be created', function() {
            var ctrl = new CpsiMapview.controller.grid.Grid();
            expect(ctrl).to.not.be(undefined);
        });
    });

    describe('Advanced', function() {
        var view;
        var ctrl;

        beforeEach(function () {
            view = Ext.create('CpsiMapview.view.grid.Grid', {
                renderTo: Ext.getBody()
            });
            ctrl = view.getController();
        });

        afterEach(function () {
            view.destroy();
        });

        it('Orders column selector dropdown alphabetically', function() {
            view.on('headermenucreate', function (grid, menu) {
                var menuItems = menu.down('[itemId=columnItem]').menu.items.items;
                var orderedTitles = menuItems.map(function (item) {
                    return item.text;
                });

                // deep array comparison - original order without sorting
                // would be [ 'Test1', 'Test3', 'Test2' ]
                expect(orderedTitles).to.eql(['Test1', 'Test2', 'Test3']);
            });

            // set fixture columns
            view.setColumns([{
                text: 'Test1'
            }, {
                text: 'Test3'
            },  {
                text: 'Test2'
            }]);

            // trigger the headermenucreate event by clicking a column header dropdown icon
            view.getEl().down('.x-column-header-trigger').dom.click();
        });

        it('Gets visible columns, adds Id prop and any extra propertyNames', function() {
            var store = view.getStore();
            var vm = ctrl.getViewModel();

            vm.set('extraPropertyNames', ['Extra']);

            // emulate a populated store
            store.isEmptyStore = false;

            // set fixture columns
            view.setColumns([{
                text: 'Test1',
                dataIndex: 'Test1',
            }, {
                text: 'Test2',
                dataIndex: 'Test2',
                hidden: true,
            }, {
                text: 'Test3',
                dataIndex: 'Test3',
            }]);

            ctrl.getVisibleColumns();

            // revert back to true to prevent errors in other tests
            store.isEmptyStore = true;

            expect(store.propertyName).to.be('id,Test1,Test3,Extra');
        });

    });
});
