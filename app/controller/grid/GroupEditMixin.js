Ext.define('CpsiMapview.controller.grid.GroupEditMixin', {
    extend: 'Ext.Mixin',
    requires: ['Ext.menu.Menu'],

    mixinConfig: {
        on: {
            init: function () {
                const me = this;
                const view = me.getView();

                view.on('afterrender', function (grid) {
                    const menu = grid.headerCt.getMenu();
                    menu.on({
                        beforeshow: me.onHeaderMenuBeforeShow,
                        scope: me
                    });
                });

                // Hide the checkbox selection column on initial load
                view.on('render', function (grid) {
                    const c = grid.columnManager.getFirst();
                    if (c) c.hide();
                });

                view.on('staterestore', function (grid, state) {
                    grid.getViewModel().set(
                        'isGroupEditingEnabled',
                        state.isGroupEditingEnabled
                    );
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
        const grid = this.getView();
        grid.getViewModel().set('isGroupEditingEnabled', state);
        if (state) {
            grid.columnManager.getFirst().show();
        } else {
            grid.columnManager.getFirst().hide();
        }
        grid.selModel.deselectAll();
    },

    onHeaderMenuBeforeShow: function (menu) {
        const me = this;
        let groupEditorMenuItem = menu.down('#groupEditorMenuItem');

        // Add custom menu items to the default grid header menu
        if (!groupEditorMenuItem && menu.activeHeader.groupEditable) {
            const groupEditorMenuItemConfig = {
                text: 'Group Edit',
                itemId: 'groupEditorMenuItem',
                tooltip:
                    'Group Edit mode must be enabled to use this menu. ' +
                    'If you do not see the Group Edit button, you may not have sufficient permissions for grid editing.',
                bind: {
                    disabled: '{!isGroupEditingEnabled}'
                },
                viewModel: {
                    parent: me.getViewModel()
                }
            };
            groupEditorMenuItem = menu.insert(menu.items.length - 2, groupEditorMenuItemConfig);
            groupEditorMenuItem.setMenu(Ext.create('Ext.menu.Menu'));
        }

        // check if it is a column that can be group edited
        if (groupEditorMenuItem && menu.activeHeader.groupEditable) {
            groupEditorMenuItem.getMenu().removeAll();
            const newMenuItems = me.createGroupEditMenuItems(menu);
            groupEditorMenuItem.menu.add(newMenuItems);
        }

        // hide/show the option depending on if the column is group editable
        if (groupEditorMenuItem) {
            groupEditorMenuItem.setVisible(!!menu.activeHeader.groupEditable);
        }
    },

    createGroupEditMenuItems: function (menu) {
        const me = this;
        const grid = me.getView();
        let newMenuItem;
        const newMenuItems = [];
        const activeHeader = menu.activeHeader;
        const filterType = activeHeader.filter.type || '';
        switch (filterType.toLowerCase()) {
            case 'list': {
                const ff = menu.down('#filters');
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
                            const list = grid.selModel
                                .getSelection()
                                .map(function (x) {
                                    return x.id;
                                });

                            me.onGroupUpdate(activeHeader, list, item.value);
                        }
                    };

                    newMenuItems.push(newMenuItem);
                });
                break;
            }
            case 'boolean': {
                // create menu options for true and false
                const trueText = activeHeader.trueText || 'true';
                const falseText = activeHeader.falseText || 'false';
                const items = [
                    { text: trueText, value: true },
                    { text: falseText, value: false }
                ];

                Ext.each(items, function (item) {
                    newMenuItem = {
                        text: item.text,
                        value: item.value,
                        handler: function (item, event) {
                            event.stopPropagation();

                            // get the list of Ids that will be updated
                            const list = grid.selModel
                                .getSelection()
                                .map(function (x) {
                                    return x.id;
                                });

                            me.onGroupUpdate(activeHeader, list, item.value);
                        }
                    };

                    newMenuItems.push(newMenuItem);
                });
                break;
            }
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
                            if (
                                event.keyCode === Ext.event.Event.ENTER &&
                                textField.isValid()
                            ) {
                                event.stopPropagation();
                                // get the list of Ids that will be updated
                                const list = grid.selModel
                                    .getSelection()
                                    .map(function (x) {
                                        return x.id;
                                    });
                                me.onGroupUpdate(
                                    activeHeader,
                                    list,
                                    textField.getValue()
                                );
                            }
                        },
                        scope: me
                    }
                };
                newMenuItems.push(newMenuItem);
                break;
            default:
                Ext.log.error(
                    'Filter type "' +
                    filterType.toLowerCase() +
                    '" not supported'
                );
                break;
        }

        return newMenuItems;
    },

    onGroupUpdate: function (activeHeader, selectedIDs, newValue) {
        const me = this;

        Ext.Msg.show({
            title: 'Group editing',
            message:
                'You are about to update ' +
                selectedIDs.length +
                ' selected items, do you want to proceed?',
            buttons: Ext.Msg.YESNO,
            scope: me,
            fn: function (buttonId) {
                let idProperty, serviceUrl;
                const data = {};

                if (buttonId == 'yes') {
                    idProperty =
                        activeHeader.groupEditIdProperty ||
                        me.getViewModel().get('idProperty');

                    if (activeHeader.groupEditService.charAt(0) === '/') {
                        serviceUrl = activeHeader.groupEditService;
                    } else {
                        serviceUrl =
                            me.getViewModel().get('serviceUrl') +
                            activeHeader.groupEditService;
                    }

                    // first char to lower case to match backend naming
                    idProperty =
                        idProperty[0].toLowerCase() + idProperty.slice(1);
                    data[idProperty] = selectedIDs;
                    data[activeHeader.groupEditDataProp] = newValue;

                    Ext.Ajax.request({
                        url: serviceUrl,
                        method: 'POST',
                        jsonData: data,
                        success: function (response) {
                            const resp = Ext.decode(response.responseText);
                            if (resp.success === true) {
                                // trigger a refresh of all related layers and stores, including the grid itself
                                // as defined by syncLayerKeys and syncStoreIds in the model
                                const clearPaging = false;
                                me.refreshStore(clearPaging);
                                const force = true;
                                me.updateAssociatedLayers(force);
                            } else {
                                Ext.Msg.show({
                                    title: 'Error',
                                    message:
                                        'Error updating the selected records: ' +
                                        resp.message,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.window.MessageBox.ERROR
                                });
                            }
                        },
                        failure: function () {
                            Ext.Msg.show({
                                title: 'Error',
                                message:
                                    'Error connecting to the update service ' +
                                    serviceUrl,
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
