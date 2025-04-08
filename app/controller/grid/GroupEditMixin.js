Ext.define('CpsiMapview.controller.grid.GroupEditMixin', {
    extend: 'Ext.Mixin',
    requires: ['Ext.menu.Menu'],
    mixinConfig: {
        on: {
            init: function () {
                var me = this;
                var view = this.getView();

                view.on('beforerender', function (grid) {
                    var dropdownMenu = grid.headerCt.getMenu();
                    dropdownMenu.on({
                        beforeshow: me.onHeaderMenuBeforeShow,
                        scope: me
                    });

                    // Add custom menu items to the default grid menu
                    dropdownMenu.insert(dropdownMenu.items.length - 2, [{
                        itemId: 'groupEditorMenuItem',
                        text: 'Group Edit',
                        tooltip: 'Group Edit mode must be enabled to use this menu. If you do not see the Group Edit button, you may not have sufficient permissions for grid editing.',
                        bind: {
                            disabled: '{!isGroupEditingEnabled}'
                        }
                    }]);
                });

                // Hide the checkbox selection column on initial load
                view.on('render', function (grid) {
                    var c = grid.columnManager.getFirst();
                    if (c) c.hide();
                });

                view.on('staterestore', function (grid, state) {
                    grid.getViewModel().set('isGroupEditingEnabled', state.isGroupEditingEnabled);
                });
            }
        }
    },

    /**
     * When the Group Edit is clicked then show the record checkbox
     * column, remove any selections, and disable paging so all
     * records are displayed
     * @param {any} btn
     * @param {any} state
     */
    onGroupEditToggle: function (btn, state) {
        var grid = this.getView();
        grid.getViewModel().set('isGroupEditingEnabled', state);
        if (state) {
            grid.columnManager.getFirst().show();
        } else {
            grid.columnManager.getFirst().hide();
        }
        grid.selModel.deselectAll();
    },

    onHeaderMenuBeforeShow: function (menu) {
        var me = this;
        var menuItem = menu.down('#groupEditorMenuItem');

        // check if it is a column that can be bulk edited
        if (!menu.activeHeader.groupEditable) {
            menuItem.hide(); // simply hide the menu if it is not editable
        } else {
            var newMenu = menuItem.menu;

            if (newMenu) {
                newMenu.removeAll();
            } else {
                newMenu = menuItem.menu = Ext.create('Ext.menu.Menu');
            }

            var newMenuItems = me.createGroupEditMenuItems(menu);
            newMenu.add(newMenuItems);
            menuItem.show();
        }
    },

    createGroupEditMenuItems: function (menu) {
        var me = this;
        var grid = me.getView();
        var newMenuItem;
        var newMenuItems = [];
        var activeHeader = menu.activeHeader;
        var filterType = activeHeader.filter.type || '';
        switch (filterType.toLowerCase()) {
            case 'list':
                var ff = menu.down('#filters');
                // create menu options based on the filter options
                Ext.each(ff.menu.items.items, function (item) {

                    if (item.value === -1) {
                        // don not create a "No Data" option
                        // but continue creating the other items
                        return true;
                    }

                    newMenuItem = {
                        text: item.text,
                        value: item.value,
                        handler: function (item, event) {
                            event.stopPropagation();

                            // get the list of Ids that will be updated
                            var list = grid.selModel.getSelection().map(function (x) {
                                return x.id;
                            });

                            me.onGroupUpdate(activeHeader, list, item.value);
                        }
                    };

                    newMenuItems.push(newMenuItem);
                });
                break;
            case 'boolean':
                // create menu options for true and false
                var trueText = activeHeader.trueText || 'true';
                var falseText = activeHeader.falseText || 'false';
                var items = [{ text: trueText, value: true }, { text: falseText, value: false }];

                Ext.each(items, function (item) {
                    newMenuItem = {
                        text: item.text,
                        value: item.value,
                        handler: function (item, event) {
                            event.stopPropagation();

                            // get the list of Ids that will be updated
                            var list = grid.selModel.getSelection().map(function (x) {
                                return x.id;
                            });

                            me.onGroupUpdate(activeHeader, list, item.value);
                        }
                    };

                    newMenuItems.push(newMenuItem);
                });
                break;
            case 'number':
                newMenuItem = {
                    xtype: 'numberfield',
                    width: 300,
                    margin: 0,
                    emptyText: 'Enter a number and press Enter',
                    allowBlank: true,
                    allowDecimals: false,
                    allowExponential: false,
                    maxLength: 5,
                    minValue: 0, // no negative numbers
                    enableKeyEvents: true,
                    listeners: {
                        keypress: function (textField, event) {
                            if (event.keyCode === Ext.event.Event.ENTER && textField.isValid()) {
                                event.stopPropagation();
                                // get the list of Ids that will be updated
                                var list = grid.selModel.getSelection().map(function (x) {
                                    return x.id;
                                });
                                me.onGroupUpdate(activeHeader, list, textField.getValue());
                            }
                        },
                        scope: me
                    }
                };
                newMenuItems.push(newMenuItem);
                break;
            default:
                Ext.log.error('Filter type "' + filterType.toLowerCase() + '" not supported');
                break;
        }

        return newMenuItems;
    },

    onGroupUpdate: function (activeHeader, selectedIDs, newValue) {

        var me = this;

        Ext.Msg.show({
            title: 'Group editing',
            message: 'You are about to update ' + selectedIDs.length + ' selected items, do you want to proceed?',
            buttons: Ext.Msg.YESNO,
            scope: me,
            fn: function (buttonId) {
                var idProperty, serviceUrl;
                var data = {};

                if (buttonId == 'yes') {
                    idProperty = activeHeader.groupEditIdProperty || me.getViewModel().get('idProperty');

                    if (activeHeader.groupEditService.charAt(0) === '/') {
                        serviceUrl = activeHeader.groupEditService;
                    } else {
                        serviceUrl = me.getViewModel().get('serviceUrl') + activeHeader.groupEditService;
                    }

                    // first char to lower case to match backend naming
                    idProperty = idProperty[0].toLowerCase() + idProperty.slice(1);
                    data[idProperty] = selectedIDs;
                    data[activeHeader.groupEditDataProp] = newValue;

                    Ext.Ajax.request({
                        url: serviceUrl,
                        method: 'POST',
                        jsonData: data,
                        success: function (response) {
                            var resp = Ext.decode(response.responseText);
                            if (resp.success === true) {
                                // trigger a refresh of all related layers and stores, including the grid itself
                                // as defined by syncLayerKeys and syncStoreIds in the model
                                var clearPaging = false;
                                me.refreshStore(clearPaging);
                                var force = true;
                                me.updateAssociatedLayers(force);
                            } else {
                                Ext.Msg.show({
                                    title: 'Error',
                                    message: 'Error updating the selected records: ' + resp.message,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.window.MessageBox.ERROR
                                });
                            }
                        },
                        failure: function () {
                            Ext.Msg.show({
                                title: 'Error',
                                message: 'Error connecting to the update service ' + serviceUrl,
                                buttons: Ext.Msg.OK,
                                icon: Ext.window.MessageBox.ERROR
                            });
                        }
                    });
                }
            }
        });
    }

});
