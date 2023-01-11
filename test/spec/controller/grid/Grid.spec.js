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
            var menu;
            // Use an override to find the menu that will be opened by the below click()
            Ext.override(Ext.menu.Menu, {
                constructor: function () {
                    var me = this;
                    me.callParent(arguments);
                    if (me.ownerCmp && me.ownerCmp.getItemId() === 'columnItem') {
                        menu = me;
                        return;
                    }
                }
            });

            // set fixture columns
            view.setColumns([{
                text: 'Test1'
            }, {
                text: 'Test3'
            },  {
                text: 'Test2'
            }]);

            // trigger creation of the menu
            view.getEl().down('.x-column-header-trigger').dom.click();

            var orderedTitles = menu.items.items.map(function (item) {
                return item.text;
            });

            // deep array comparison - original order without sorting would be [ 'Test1', 'Test3', 'Test2' ]
            expect(orderedTitles).to.eql(['Test1', 'Test2', 'Test3']);
        });

    });
});
