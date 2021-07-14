/**
 * A mixin for any edit window controller allowing for
 * validation, saving, deletion, exports etc.
 *
 * @class CpsiMapview.form.ControllerMixin
 */
Ext.define('CpsiMapview.form.ControllerMixin', {
    extend: 'Ext.Mixin',
    mixins: {
        zoomer: 'CpsiMapview.util.ZoomerMixin',
        validation: 'CpsiMapview.form.ValidationMessages'
    },

    /** The possible return codes from the services */
    errorCodes: {
        None: 0,
        AccountLockedOut: 1,
        AccountDoesNotExist: 2,
        UserTokenExpired: 3,
        CookieHeaderMissing: 4,
        NoPermission: 5,

        GeneralServerError: 500,
        FileNotFound: 404
    },

    getResponseJson: function (operation) {

        var response = operation.getResponse();

        // IE11 does not use responseJson and instead we have to decode the JSON in responseText
        return response.responseJson ? response.responseJson : Ext.JSON.decode(response.responseText);
    },

    /**
     * Action when save fails
     * @param {any} record
     * @param {any} operation
     */
    onSaveFailed: function (record, operation) {

        var me = this;
        var response = operation.getResponse() ? operation.getResponse() : operation._response;

        var result = !response ? { errorCode: me.errorCodes.GeneralServerError } :
            (response.responseType == 'json'
                ? response.responseJson
                : (response.responseXML ? response.responseXML : JSON.parse(response.responseText))
            );
        switch (result.errorCode) {
            case me.errorCodes.UserTokenExpired:
            case me.errorCodes.CookieHeaderMissing:
                // if the error is related to session expired it has been managed in CpsiMapview.util.ApplicationMixin, we'll ignore it here.
                break;
            default:
                Ext.Msg.show({
                    title: 'Error',
                    message: (operation.error ? operation.error.statusText : (!Ext.isEmpty(result.message) ? result.message : 'The save operation failed.')),
                    buttons: Ext.MessageBox.OK,
                    iconCls: Ext.MessageBox.ERROR
                });
        }
    },

    /**
     * Action when save succeeds
     * @param {any} record
     * @param {any} operation
     */
    onSaveSucceded: function (record, operation) {

        var me = this;

        var vm = me.getViewModel();

        // ensure the client-side record matches the server record
        // by loading the response back into the model

        var response = operation.getResponse();
        var serverData = response.responseJson ? response.responseJson.data : JSON.parse(response.responseText).data;
        var modelPrototype = Ext.ClassManager.get(record.$className);
        var serverRec = modelPrototype.loadData(serverData);

        me.reloadRecord(serverRec);

        var itemName = vm.get('parentType') || 'Item';
        Ext.Msg.show({
            title: 'Success',
            message: itemName + ' saved successfully!',
            buttons: Ext.MessageBox.OK,
            iconCls: Ext.MessageBox.INFO
        });

        // fire an event
        var view = me.getView();
        view.fireEvent('savesucceeded');
    },

    /**
     * Action when the save button is clicked
     * */
    onSaveClick: function () {
        var me = this;
        var win = me.getView();
        var vm = me.getViewModel();
        var f = win.down('form');
        if (!f) {
            throw 'Editing windows must have a top level "xtype: \'form\'" container';
        }

        var currentRecord = vm.get('currentRecord');

        // currentRecord.getData({associated: true})
        // to check JSON that will be sent to the server
        //currentRecord.getProxy().getWriter().getRecordData(currentRecord)

        var goAhead = f.isValid() && (!this.beforeSave || this.beforeSave());

        if (goAhead) {
            me.saveRecord();
        }
    },

    /**
     * Save the current record to the server
     */
    saveRecord: function () {

        var me = this;
        var win = me.getView();
        var vm = me.getViewModel();
        var currentRecord = vm.get('currentRecord');

        win.mask('Saving...');
        currentRecord.save({
            failure: me.onSaveFailed,
            success: me.onSaveSucceded,
            callback: function () {
                // do something whether the save succeeded or failed
                win.unmask();
            },
            scope: me
        });

    },

    /**
     * Action when a delete fails
     * @param {any} record
     * @param {any} operation
     */
    onDeleteFailed: function (record, operation) {
        Ext.log('ERASE FAILED');
        Ext.Msg.alert('Error', operation.getResponse().responseJson.message);
    },

    /**
     * Action when a delete succeeds
     * @param {any} record
     */
    onDeleteSucceeded: function (record) {

        var me = this;
        // trigger grid refresh
        record.onModelSaved();
        record.destroy();

        // close the window
        var w = me.getView();
        w.close();
    },

    /**
     * Action for deletion
     * */
    onDelete: function () {
        var me = this;
        var w = me.getView();
        var vm = w.getViewModel();
        w.mask('Deleting...');
        var rec = vm.get('currentRecord');
        rec.proxy.erase(Ext.create('Ext.data.operation.Destroy', {
            url: rec.proxy.getUrl(),
            records: [rec],
            callback: function (records, operation, success) {
                w.unmask();
                // do something whether the delete succeeded or failed
                if (success) {
                    me.onDeleteSucceeded(records[0], operation);
                }
                else {
                    me.onDeleteFailed(records[0], operation);
                }
            },
            scope: me
        }));
    },

    onDeleteCancel: Ext.emptyFn,

    /**
     * Action when the delete button is clicked
     * */
    onDeleteClick: function () {

        var me = this;
        var beforeDeleteConfig = { avoidConfirmationRequest: false };
        var goAhead = (me.beforeDelete ? me.beforeDelete(beforeDeleteConfig) : true);
        if (goAhead) {
            if (beforeDeleteConfig.avoidConfirmationRequest) {
                me.onDelete.call(me);
            } else {
                Ext.Msg.confirm('Delete', 'Are you sure you want to proceed with deletion?',
                    function (buttonId) {
                        if (buttonId == 'yes') {
                            me.onDelete.call(me);
                        } else {
                            me.onDeleteCancel.call(me);
                        }
                    }
                );
            }
        }
        else {
            me.onDeleteCancel.call(me);
        }
    },

    /**
     * Action when the cancel button is clicked
     * */
    onCancelClick: function () {
        var win = this.getView();
        var goAhead = !this.beforeCancel || this.beforeCancel();
        if (goAhead) {
            var rec = this.getViewModel().get('currentRecord');
            if (rec) {
                rec.reject();
            }
            win.close();
        }
    },

    /**
     * Action when the export button is clicked
     * */
    onExportClick: Ext.emptyFn,

    /**
     * Action when the zoom button is clicked
     */
    onZoomClick: function () {
        var me = this;
        var goAhead = !me.beforeZoom || me.beforeZoom();
        if (goAhead) {
            // call the mixin function with the controller as the scope
            me.mixins.zoomer.zoomToRecordExtent.call(me);
        }
    },

    /**
     * Reload a record with fresh data from the server
     * @param {any} serverRec
     */
    reloadRecord: function (serverRec) {

        var me = this;
        var vm = me.getViewModel();

        // destroy the previously loaded record to ensure any feature stores
        // are removed and recreated
        var existingRec = vm.get('currentRecord');
        vm.set('currentRecord', serverRec);
        vm.notify(); // flush all bindings, otherwise the grid may still be bound to the old layer

        // we also need to update the featureStores for any associated tools
        // as when a model is reloaded then the featureStore and layer
        // are recreated, and the tool is pointing to the old layer

        // see bindings in CpsiMapview.form.ViewMixin

        var resultLayer = vm.get('resultLayer');
        var polygonLayer = vm.get('polygonLayer');
        var vw = me.getView();

        var tool, toolCtrl;

        if (vm.get('hideDigitisePointButton') === false) {
            tool = vw.down('#pointDigitiserButton');
            toolCtrl = tool.getController();
            toolCtrl.setResultLayer(resultLayer);
            toolCtrl.setDrawLayer(resultLayer);
        }

        if (vm.get('hideDigitiseAreaButton') === false) {
            tool = vw.down('#areaDigitiserButton');
            toolCtrl = tool.getController();
            toolCtrl.setResultLayer(resultLayer);
            toolCtrl.setDrawLayer(polygonLayer);
        }

        if (vm.get('circleDigitiserButton') === false) {
            tool = vw.down('#circleDigitiserButton');
            toolCtrl = tool.getController();
            toolCtrl.setResultLayer(resultLayer);
            toolCtrl.setDrawLayer(polygonLayer);
        }

        if (vm.get('hideDigitiseSegmentButton') === false) {
            tool = vw.down('#segmentDigitiserButton');
            toolCtrl = tool.getController();
            toolCtrl.setResultLayer(resultLayer);
        }

        // only destroy this after the new record has been set as getting errors in checkHadValue > getChildValue
        // it seems to be an issue with checkBoxes only
        existingRec.destroy();
    },

    /**
    * Allow a record to be reloaded from the server
    **/
    onRefreshClick: function () {

        var me = this;
        var win = me.getView();
        var vm = me.getViewModel();

        win.mask('Refreshing Record...');

        var currentRecord = vm.get('currentRecord');

        // only allow refreshing of existing records
        if (!currentRecord || currentRecord.isPhantom()) {
            return;
        }

        var modelPrototype = Ext.ClassManager.get(currentRecord.$className);

        modelPrototype.load(currentRecord.getId(), {
            success: me.reloadRecord,
            callback: function () {
                win.unmask();
            },
            scope: this
        });
    },

    /**
     * Do not allow the tab to change if a grid is currently
     * being edited (the wrong data could be saved)
     * @param {any} tabPanel
     * @param {any} newCard
     * @param {any} oldCard
     */
    onBeforeTabChange: function (tabPanel, newCard, oldCard) {
        var grids = oldCard.down('grid');

        var ret = true;

        Ext.each(grids, function (grid) {
            var editingPlugin = grid.editingPlugin;
            if (editingPlugin && editingPlugin.editing) {
                ret = false;
            }
        });

        return ret;
    },

    onFieldChanged: function () {
        var me = this;
        var vm = me.getViewModel();
        var rec = vm.get('currentRecord');
        if (rec) {
            // call the mixin function with the controller as the scope
            var isValid = me.mixins.validation.checkValid.call(me, rec);

            // we can't just set the canSave to valid as there may be other logic for the canSave function
            // so set valid property which is one of the bindings to the canSave function
            vm.set('valid', isValid);
        }
    }
});