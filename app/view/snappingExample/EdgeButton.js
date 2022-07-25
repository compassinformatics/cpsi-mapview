Ext.define('CpsiMapview.view.snappingExample.EdgeModel', {
    extend: 'Ext.data.Model',
    requires: [
        'CpsiMapview.field.Line'
    ],
    mixins: {
        //eventsMixin: 'CpsiMapview.model.FeatureEventsMixin',
        features: 'CpsiMapview.model.FeatureStoreMixin'
    },
    idProperty: 'edgeId',
    fields: [
        {
            name: 'edgeId',
            type: 'int',
            defaultValue: null,
            persist: false
        },
        {
            name: 'startNodeId',
            type: 'int',
            allowNull: true,
            defaultValue: null
        },
        {
            name: 'endNodeId',
            type: 'int',
            allowNull: true,
            defaultValue: null
        },
        {
            name: 'startEdgeId',
            type: 'int',
            allowNull: true,
            defaultValue: null
        },
        {
            name: 'endEdgeId',
            type: 'int',
            allowNull: true,
            defaultValue: null
        },
        {
            name: 'startCoord',
            type: 'auto',
            allowNull: true,
            defaultValue: null
        },
        {
            name: 'endCoord',
            type: 'auto',
            allowNull: true,
            defaultValue: null
        },
        {
            name: 'geometry',
            type: 'line'
        },
    ]
});

Ext.define('CpsiMapview.view.snappingExample.EdgeButton', {
    extend: 'Ext.button.Button',
    xtype: 'cmv_edgebutton',
    handler: function () {
        if (!this.window) {
            var rec = Ext.create('CpsiMapview.view.snappingExample.EdgeModel', { edgeId: null });
            this.window = Ext.create('CpsiMapview.view.snappingExample.EdgeWindow');

            var vm = this.window.getViewModel();
            vm.set('currentRecord', rec);

        }
        this.window.show();
    }
});
