describe('CpsiMapview.controller.grid.Grid', function() {
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
            // set up spy to monitor the function that sorts the menu items
            var onHeaderMenuCreateSpy = sinon.spy(ctrl, 'onHeaderMenuCreate');

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

            // assert the handler for headermenucreate event was called
            expect(onHeaderMenuCreateSpy.calledOnce).to.be(true);

            // get a reference to the menu by taking it from the spy arguments
            var menu = onHeaderMenuCreateSpy.getCalls()[0].args[1];
            var menuItems = menu.down('[itemId=columnItem]').menu.items.items;
            var orderedTitles = menuItems.map(function (item) {
                return item.text;
            })

            // deep array comparison - original order without sorting would be [ 'Test1', 'Test3', 'Test2' ]
            expect(orderedTitles).to.eql(['Test1', 'Test2', 'Test3']);

            // clean up spy
            onHeaderMenuCreateSpy.restore();
        });

    });
});
