/**
 * This class is the view model for the SplitByClickButtonModel.
 */
Ext.define('CpsiMapview.model.button.SplitByClickButtonModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.cmv_split_by_click_button',

    data: {
        tooltip:
            'Click on a road to split an edge into two parts - public and private'
    }
});
