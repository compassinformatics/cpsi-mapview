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
        validation: 'CpsiMapview.form.ValidationMessagesMixin'
    },

    toolListenerAdded: false,

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
        const response = operation.getResponse();

        // IE11 does not use responseJson and instead we have to decode the JSON in responseText
        return response.responseJson
            ? response.responseJson
            : Ext.JSON.decode(response.responseText);
    },

    /**
     * Action when save fails
     * @param {any} record
     * @param {any} operation
     */
    onSaveFailed: function (record, operation) {
        const me = this;
        const response = operation.getResponse()
            ? operation.getResponse()
            : operation._response;

        const result = !response
            ? { errorCode: me.errorCodes.GeneralServerError }
            : response.responseType == 'json'
              ? response.responseJson
              : response.responseXML
                ? response.responseXML
                : JSON.parse(response.responseText);
        switch (result.errorCode) {
            case me.errorCodes.UserTokenExpired:
            case me.errorCodes.CookieHeaderMissing:
                // if the error is related to session expired it has been managed in CpsiMapview.util.ApplicationMixin, we'll ignore it here.
                break;
            default:
                Ext.Msg.show({
                    title: 'Error',
                    message: operation.error
                        ? operation.error.statusText
                        : !Ext.isEmpty(result.message)
                          ? result.message
                          : 'The save operation failed.',
                    buttons: Ext.MessageBox.OK,
                    iconCls: Ext.MessageBox.ERROR
                });
        }

        // fire an event that saving the model failed
        const view = me.getView();
        view.fireEvent('savefailed');
    },

    /**
     * Action when save succeeds
     * @param {any} record
     * @param {any} operation
     */
    onSaveSucceded: function (record, operation) {
        const me = this;

        const vm = me.getViewModel();

        // ensure the client-side record matches the server record
        // by loading the response back into the model

        const response = operation.getResponse();
        const serverData = response.responseJson
            ? response.responseJson.data
            : JSON.parse(response.responseText).data;
        const modelPrototype = Ext.ClassManager.get(record.$className);
        const serverRec = modelPrototype.loadData(serverData);

        me.reloadRecord(serverRec);

        const itemName = vm.get('parentType') || 'Item';
        Ext.Msg.show({
            title: 'Success',
            message: itemName + ' saved successfully!',
            buttons: Ext.MessageBox.OK,
            iconCls: Ext.MessageBox.INFO
        });

        // fire an event
        const view = me.getView();
        view.fireEvent('savesucceeded');
    },

    /**
     * Action when the save button is clicked
     * Previously form.isValid() was checked in this function, but values on
     * a tab that has not been displayed are only bound later, so this
     * incorrectly returns that a form is invalid
     * */
    onSaveClick: function () {
        const me = this;
        const modelIsValid = me.getViewModel().get('currentRecord').isValid();
        const goAhead = modelIsValid && (!this.beforeSave || this.beforeSave());

        if (goAhead) {
            me.saveRecord();
        }
    },

    /**
     * Save the current record to the server
     */
    saveRecord: function () {
        const me = this;
        const win = me.getView();
        const vm = me.getViewModel();
        const currentRecord = vm.get('currentRecord');

        // use currentRecord.getData({associated: true})
        // to check JSON that will be sent to the server
        // or currentRecord.getProxy().getWriter().getRecordData(currentRecord)

        win.mask('Saving...');
        currentRecord.save({
            failure: me.onSaveFailed,
            success: me.onSaveSucceded,
            callback: function () {
                // do something whether the save succeeded or failed
                // but ensure the window has not been destroyed by any savesucceeded handlers
                if (win.destroyed === false) {
                    win.unmask();
                }
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
        const me = this;
        // trigger grid refresh
        record.onModelSaved();
        record.destroy();

        // fire an event
        const view = me.getView();
        view.fireEvent('deletesucceeded');

        // close the window
        view.close();
    },

    /**
     * Override this function to return any additional parameters to send to
     * the Delete URL as a querystring
     *
     * @returns An object of key value pairs
     */
    getDeleteParameters: function () {
        return {};
    },
    /**
     * Action for deletion
     * */
    onDelete: function () {
        const me = this;
        const w = me.getView();
        const vm = w.getViewModel();
        w.mask('Deleting...');
        const rec = vm.get('currentRecord');
        rec.proxy.erase(
            Ext.create('Ext.data.operation.Destroy', {
                url: rec.proxy.getUrl(),
                records: [rec],
                params: me.getDeleteParameters(),
                callback: function (records, operation, success) {
                    w.unmask();
                    // do something whether the delete succeeded or failed
                    if (success) {
                        me.onDeleteSucceeded(records[0], operation);
                    } else {
                        me.onDeleteFailed(records[0], operation);
                    }
                },
                scope: me
            })
        );
    },

    onDeleteCancel: Ext.emptyFn,

    /**
     * Action when the delete button is clicked
     * */
    onDeleteClick: function () {
        const me = this;
        const beforeDeleteConfig = { avoidConfirmationRequest: false };
        const goAhead = me.beforeDelete
            ? me.beforeDelete(beforeDeleteConfig)
            : true;
        if (goAhead) {
            if (beforeDeleteConfig.avoidConfirmationRequest) {
                me.onDelete.call(me);
            } else {
                Ext.Msg.confirm(
                    'Delete',
                    'Are you sure you want to proceed with deletion?',
                    function (buttonId) {
                        if (buttonId == 'yes') {
                            me.onDelete.call(me);
                        } else {
                            me.onDeleteCancel.call(me);
                        }
                    }
                );
            }
        } else {
            me.onDeleteCancel.call(me);
        }
    },

    /**
     * Action when the cancel button is clicked
     * */
    onCancelClick: function () {
        const win = this.getView();
        const goAhead = !this.beforeCancel || this.beforeCancel();
        if (goAhead) {
            const rec = this.getViewModel().get('currentRecord');
            if (rec) {
                rec.reject();
            }
            win.close();
        }
    },

    /**
     * Action when the close button is clicked.
     */
    onCloseClick: function () {
        const win = this.getView();
        win.close();
    },

    /**
     * Action when the export button is clicked
     * */
    onExportClick: Ext.emptyFn,

    /**
     * Action when the zoom button is clicked
     */
    onZoomClick: function () {
        const me = this;
        const goAhead = !me.beforeZoom || me.beforeZoom();
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
        const me = this;
        const vm = me.getViewModel();

        // destroy the previously loaded record to ensure any feature stores
        // are removed and recreated
        const existingRec = vm.get('currentRecord');
        vm.set('currentRecord', serverRec);
        vm.notify(); // flush all bindings, otherwise the grid may still be bound to the old layer

        // also reset the listener added flag as once reloaded the layers have a different source
        me.toolListenerAdded = false;

        // we also need to update the featureStores for any associated tools
        // as when a model is reloaded then the featureStore and layer
        // are recreated, and the tool is pointing to the old layer

        // see bindings in CpsiMapview.form.ViewMixin

        const resultLayer = vm.get('resultLayer');
        const polygonLayer = vm.get('polygonLayer');
        const vw = me.getView();

        let toolCtrl;

        // get all digitising tools that are part of the map toggleGroup and visible
        const toolButtons = vw.query('button[toggleGroup=map][hidden=false]');

        // now ensure that the tool layers are updated to reflect the new layers/stores
        Ext.each(toolButtons, function (toolBtn) {
            toolCtrl = toolBtn.getController();

            if (toolCtrl.setResultLayer) {
                // ensure scope is set to the controller when calling the function
                toolCtrl.setResultLayer(resultLayer);
            }

            // set the polygonLayer for polygon tools
            if (toolBtn.type === 'Polygon' || toolBtn.type === 'Circle') {
                //<debug>
                Ext.Assert.truthy(polygonLayer);
                //</debug>
                toolCtrl.setDrawLayer(polygonLayer);
            } else {
                // the resultLayer and drawLayer are the same layer for the local editing tools
                if (
                    Ext.Array.contains(
                        ['lineDigitiserButton', 'pointDigitiserButton'],
                        toolBtn.getItemId()
                    )
                ) {
                    toolCtrl.setDrawLayer(resultLayer);
                }
            }
        });

        // only destroy this after the new record has been set as getting errors in checkHadValue > getChildValue
        // it seems to be an issue with checkBoxes only
        existingRec.destroy();
    },

    /**
     * Allow a record to be reloaded from the server
     **/
    onRefreshClick: function () {
        const me = this;
        const win = me.getView();
        const vm = me.getViewModel();

        win.mask('Refreshing Record...');

        const currentRecord = vm.get('currentRecord');

        // only allow refreshing of existing records
        if (!currentRecord || currentRecord.isPhantom()) {
            return;
        }

        const modelPrototype = Ext.ClassManager.get(currentRecord.$className);

        modelPrototype.load(currentRecord.getId(), {
            success: function (serverRec) {
                me.reloadRecord(serverRec);
                // fire the refreshsucceeded event outside of reloadRecord function to avoid two calls
                // as reloadRecord is also called in onSaveSucceded
                win.fireEvent('refreshsucceeded');
            },
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
        const grids = oldCard.down('grid');

        let ret = true;

        Ext.each(grids, function (grid) {
            const editingPlugin = grid.editingPlugin;
            if (editingPlugin && editingPlugin.editing) {
                ret = false;
            }
        });

        return ret;
    },

    onFieldChanged: function () {
        const me = this;
        const vm = me.getViewModel();
        const rec = vm.get('currentRecord');
        if (rec) {
            // call the mixin function with the controller as the scope
            me.mixins.validation.checkValid.call(me, rec);

            // update a custom timestamp property on the viewmodel
            // so any validation logic can be retriggered if required
            vm.set('timestamp', Ext.Date.now());
        }
    },

    /**
     * Several forms can have both a line and polygon editing tools
     * When a user switches from the polygon tool to the line tool
     * the polygon should be removed so it is not sent to the server
     */
    onEdgesModified: function (evt) {
        const me = this;
        const vm = me.getViewModel();
        const modifications = evt.modifications;

        if (
            modifications.newEdgeCount > 0 &&
            modifications.toolType !== 'Polygon' &&
            modifications.toolType !== 'Circle'
        ) {
            const polygonLayer = vm.get('polygonLayer');
            if (polygonLayer) {
                polygonLayer.getSource().clear();
            }
        }
    },

    /**
     * Whenever one of the digitizing buttons is activated
     * add a listener to check for modifications to edges
     * We can only add this listener when the tools are activated or the resultLayer
     * won't have been created
     */
    onDigitizingToolToggle: function () {
        const me = this;
        const vm = me.getViewModel();
        const resultLayer = vm.get('resultLayer');

        if (resultLayer && me.toolListenerAdded === false) {
            resultLayer
                .getSource()
                .on('featuresupdated', me.onEdgesModified.bind(me));
            me.toolListenerAdded = true;
        }
    }
});
