
/**
 *  To be mixed in to the controller of a grid which uses ItemDeleter
 *  Can be provided with the following custom handlers 
 * 
 *  - beforeDelete          => if returns "false" deletion is aborted, runs BEFORE the user is asked for confirmation
 * 
 *  - onRowDeleteFail       => do something if the delete failed
 *  - onRowDeleteSuccess    => do something if the delete succeeded
 *  - onRowDeleteCallback   => do something whether the delete succeeded or failed
 * 
 *  - doDelete              => the actual deletion implementation, if the user confirms
 *  - dontDelete            => in case we want to do something when the user doesn't confirim or beforeDelete returns false
 */

Ext.define('CpsiMapview.controller.grid.ItemDeleterGridControllerMixin', {
    extend: 'Ext.Mixin',

    beforeDelete: function(config) {return true;},
    onRowDeleteFail: Ext.emptyFn,
    onRowDeleteSuccess: Ext.emptyFn,
    onRowDeleteCallback: Ext.emptyFn,

    // what to do for deleting
    onRowDelete: function (tableView, rowIndex, colIndex, item, e, record, tableRow) {
        record.erase({
            failure: this.onRowDeleteFail,
            success: this.onRowDeleteSuccess,
            callback: this.onRowDeleteCallback
        });
    },

    // what to do for not deleting (either canceled by user or by business logic)
    onRowDeleteCanceled: Ext.emptyFn,

    onDeleteRowClick: function (tableView, rowIndex, colIndex, item, e, record, tableRow) {
        var me = this;
        var beforeDeleteConfig = { avoidConfirmationRequest: item.avoidConfirmationRequest || false, record: record };
        var goAhead = (me.beforeDelete ? me.beforeDelete(beforeDeleteConfig) : true);
        if (goAhead) {
            if (beforeDeleteConfig.avoidConfirmationRequest) {
                me.onRowDelete(tableView, rowIndex, colIndex, item, e, record, tableRow);
            } else {
                Ext.Msg.confirm('Delete', 'Are you sure you want to proceed with deletion?',
                    function (buttonId) {
                        if (buttonId == 'yes') {
                            me.onRowDelete(tableView, rowIndex, colIndex, item, e, record, tableRow);
                        } else {
                            me.onRowDeleteCanceled(tableView, rowIndex, colIndex, item, e, record, tableRow);
                        }
                    }
                );
            }
        }
        else {
            me.onRowDeleteCanceled(tableView, rowIndex, colIndex, item, e, record, tableRow);
        }
    }

});