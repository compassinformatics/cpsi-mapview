/**
 *  To be mixed in to the controller of a grid which uses ItemDeleter
 *  Can be provided with the following custom handlers
 *
 *  - beforeDelete          => if returns "false" deletion is aborted, runs BEFORE the user is asked for confirmation
 *
 *  - onRowDelete           => the actual deletion implementation, if the user confirms
 *  - onRowDeleteCancelled  => in case we want to do something when the user doesn't confirm or beforeDelete returns false
 */

Ext.define('CpsiMapview.controller.grid.ItemDeleterGridControllerMixin', {
    extend: 'Ext.Mixin',

    beforeDelete: function (/*config*/) {
        return true;
    },
    onRowDeleteFail: Ext.emptyFn,
    onRowDeleteSuccess: Ext.emptyFn,
    onRowDeleteCallback: Ext.emptyFn,

    /**
     * Function to run when a user selects to delete a row. Override this as required.
     */
    onRowDelete: function (tableView, rowIndex, colIndex, item, e, record) {
        tableView.getStore().remove(record);
    },

    /**
     * Function to run when delete is cancelled by the user or by business logic. Override this as required.
     */
    onRowDeleteCancelled: Ext.emptyFn,

    onDeleteRowClick: function (
        tableView,
        rowIndex,
        colIndex,
        item,
        e,
        record,
        tableRow
    ) {
        const me = this;
        const beforeDeleteConfig = {
            avoidConfirmationRequest: item.avoidConfirmationRequest || false,
            record: record
        };
        const goAhead = me.beforeDelete
            ? me.beforeDelete(beforeDeleteConfig)
            : true;
        if (goAhead) {
            if (beforeDeleteConfig.avoidConfirmationRequest) {
                me.onRowDelete(
                    tableView,
                    rowIndex,
                    colIndex,
                    item,
                    e,
                    record,
                    tableRow
                );
            } else {
                Ext.Msg.confirm(
                    'Delete',
                    'Are you sure you want to proceed with deletion?',
                    function (buttonId) {
                        if (buttonId == 'yes') {
                            me.onRowDelete(
                                tableView,
                                rowIndex,
                                colIndex,
                                item,
                                e,
                                record,
                                tableRow
                            );
                        } else {
                            me.onRowDeleteCancelled(
                                tableView,
                                rowIndex,
                                colIndex,
                                item,
                                e,
                                record,
                                tableRow
                            );
                        }
                    }
                );
            }
        } else {
            me.onRowDeleteCancelled(
                tableView,
                rowIndex,
                colIndex,
                item,
                e,
                record,
                tableRow
            );
        }
    }
});
