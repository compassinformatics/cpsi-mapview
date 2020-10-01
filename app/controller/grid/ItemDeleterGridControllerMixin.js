Ext.define('CpsiMapview.controller.grid.ItemDeleterGridControllerMixin', {
    extend: 'Ext.Mixin',

    onDeleteRowClick: function (tableView, rowIndex, colIndex, item, e, record, tableRow) {
        var me = this;
        // what to do for deleting
        var doDelete = function () {
            record.erase({
                failure: function (/*record, operation*/) {
                    // do something if the delete failed
                },
                success: function (/*record, operation*/) {
                    // do something if the delete succeeded
                },
                callback: function (/*record, operation, success*/) {
                    // do something whether the delete succeeded or failed
                }
            });
        };
        // what to do for not deleting
        var dontDelete = function () {
        };
        var beforeDeleteConfig = { avoidConfirmationRequest: item.avoidConfirmationRequest || false };
        var goAhead = (me.beforeDelete ? me.beforeDelete(beforeDeleteConfig) : true);
        if (goAhead) {
            if (beforeDeleteConfig.avoidConfirmationRequest) {
                doDelete();
            } else {
                Ext.Msg.confirm('Delete', 'Are you sure you want to proceed with deletion?',
                    function (buttonId) {
                        if (buttonId == 'yes') {
                            doDelete();
                        } else {
                            dontDelete();
                        }
                    }
                );
            }
        }
        else {
            dontDelete();
        }
    }

});