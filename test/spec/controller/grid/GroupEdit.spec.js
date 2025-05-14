Ext.define('CpsiMapview.controller.TestGroupEditController', {
    extend: 'CpsiMapview.controller.grid.Grid',
    alias: 'controller.test_groupeditgrid',
    mixins: ['CpsiMapview.controller.grid.GroupEditMixin']
});

Ext.define('CpsiMapview.view.TestGroupEditGrid', {
    extend: 'CpsiMapview.view.grid.Grid',
    requires: ['CpsiMapview.controller.TestGroupEditController'],
    controller: 'test_groupeditgrid',
    // Added for Group Edit
    selModel: {
        selType: 'featurecheckboxmodel',
        checkOnly: false,
        selectStyle: new ol.style.Style({
            stroke: new ol.style.Stroke({
                width: 10,
                color: '#0ff'
            })
        })
    },
    columns: {
        items: [
            {
                text: '<i class="x-fa fa-pencil"></i> Editable?',
                dataIndex: 'Editable',
                flex: 0.3,
                hidden: false,
                xtype: 'booleancolumn',
                trueText: 'Yes',
                falseText: 'No',
                groupEditable: true,
                groupEditService: 'myGroupEditService',
                groupEditDataProp: 'myEditableProperty',
                filter: {
                    type: 'boolean'
                }
            }
        ]
    }
});

describe('CpsiMapview.controller.grid.GroupEditMixin', function () {
    Ext.Loader.syncRequire(['CpsiMapview.controller.grid.GroupEditMixin']);

    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.controller.grid.GroupEditMixin).not.to.be(
                undefined
            );
        });

        it('can be created', function () {
            const mixin = new CpsiMapview.controller.grid.GroupEditMixin();
            expect(mixin).to.not.be(undefined);
        });

        it('example can be created', function () {
            const grid = new CpsiMapview.view.TestGroupEditGrid();
            expect(grid).not.to.be(undefined);
        });
    });
});
