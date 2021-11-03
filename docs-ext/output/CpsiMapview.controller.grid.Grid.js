Ext.data.JsonP.CpsiMapview_controller_grid_Grid({"tagname":"class","name":"CpsiMapview.controller.grid.Grid","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"Grid.js","href":"Grid.html#CpsiMapview-controller-grid-Grid"}],"aliases":{"controller":["cmv_grid"]},"alternateClassNames":[],"extends":"Ext.app.ViewController","mixins":[],"requires":["BasiGX.util.Layer","CpsiMapview.util.Layer","CpsiMapview.util.WmsFilter","Ext.grid.filters.Filters","Ext.menu.Menu","GeoExt.util.OGCFilter"],"uses":[],"members":[{"name":"spatialFilter","tagname":"cfg","owner":"CpsiMapview.controller.grid.Grid","id":"cfg-spatialFilter","meta":{}},{"name":"activatePresetFilterButton","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-activatePresetFilterButton","meta":{}},{"name":"addChildModelListener","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-addChildModelListener","meta":{"private":true}},{"name":"applyPresetFilters","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-applyPresetFilters","meta":{}},{"name":"applyStoreToGrid","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-applyStoreToGrid","meta":{}},{"name":"clearFilters","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-clearFilters","meta":{"private":true}},{"name":"createNumberFilterValue","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-createNumberFilterValue","meta":{}},{"name":"exportToExcel","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-exportToExcel","meta":{"private":true}},{"name":"exportToShapefile","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-exportToShapefile","meta":{"private":true}},{"name":"getLayerByKey","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-getLayerByKey","meta":{"private":true}},{"name":"getOlLayer","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-getOlLayer","meta":{}},{"name":"getVisibleColumns","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-getVisibleColumns","meta":{}},{"name":"initViewModel","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-initViewModel","meta":{"private":true}},{"name":"onClearSort","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-onClearSort","meta":{}},{"name":"onColumnHide","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-onColumnHide","meta":{"private":true}},{"name":"onColumnShow","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-onColumnShow","meta":{"private":true}},{"name":"onColumnsReconfigure","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-onColumnsReconfigure","meta":{"private":true}},{"name":"onIdFilterSet","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-onIdFilterSet","meta":{}},{"name":"onItemContextMenu","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-onItemContextMenu","meta":{"private":true}},{"name":"onRowDblClick","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-onRowDblClick","meta":{"private":true}},{"name":"onShow","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-onShow","meta":{}},{"name":"onSpatialFilter","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-onSpatialFilter","meta":{"private":true}},{"name":"onWfsStoreAfterLoad","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-onWfsStoreAfterLoad","meta":{"private":true}},{"name":"onWfsStoreBeforeLoad","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-onWfsStoreBeforeLoad","meta":{"private":true}},{"name":"refreshStore","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-refreshStore","meta":{}},{"name":"resetFilters","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-resetFilters","meta":{}},{"name":"toggleLayerVisibility","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-toggleLayerVisibility","meta":{}},{"name":"togglePaging","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-togglePaging","meta":{"private":true}},{"name":"updateAssociatedLayers","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-updateAssociatedLayers","meta":{"private":true}},{"name":"zoomToFeature","tagname":"method","owner":"CpsiMapview.controller.grid.Grid","id":"method-zoomToFeature","meta":{"private":true}}],"code_type":"ext_define","id":"class-CpsiMapview.controller.grid.Grid","component":false,"superclasses":["Ext.app.ViewController"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.app.ViewController<div class='subclass '><strong>CpsiMapview.controller.grid.Grid</strong></div></div><h4>Requires</h4><div class='dependency'>BasiGX.util.Layer</div><div class='dependency'><a href='#!/api/CpsiMapview.util.Layer' rel='CpsiMapview.util.Layer' class='docClass'>CpsiMapview.util.Layer</a></div><div class='dependency'><a href='#!/api/CpsiMapview.util.WmsFilter' rel='CpsiMapview.util.WmsFilter' class='docClass'>CpsiMapview.util.WmsFilter</a></div><div class='dependency'>Ext.grid.filters.Filters</div><div class='dependency'>Ext.menu.Menu</div><div class='dependency'>GeoExt.util.OGCFilter</div><h4>Files</h4><div class='dependency'><a href='source/Grid.html#CpsiMapview-controller-grid-Grid' target='_blank'>Grid.js</a></div></pre><div class='doc-contents'><p>This class is the controller for the cpsi mapview WFS\ngeneric grid class</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-spatialFilter' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-cfg-spatialFilter' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-cfg-spatialFilter' class='name expandable'>spatialFilter</a> : Ext.util.Filter<span class=\"signature\"></span></div><div class='description'><div class='short'><p>The currently active spatial filter for the layer.</p>\n</div><div class='long'><p>The currently active spatial filter for the layer.</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-activatePresetFilterButton' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-activatePresetFilterButton' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-activatePresetFilterButton' class='name expandable'>activatePresetFilterButton</a>( <span class='pre'>viewModel</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Activated the \"preset filter\" button if the layer\nhas the respective properties. ...</div><div class='long'><p>Activated the \"preset filter\" button if the layer\nhas the respective properties.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>viewModel</span> : Ext.app.ViewModel <div class='sub-desc'><p>The ViewModel</p>\n</div></li></ul></div></div></div><div id='method-addChildModelListener' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-addChildModelListener' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-addChildModelListener' class='name expandable'>addChildModelListener</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>If any models associated with the grid are edited\n(for example in a child form) then automatically update\nthe grid an...</div><div class='long'><p>If any models associated with the grid are edited\n(for example in a child form) then automatically update\nthe grid and associated layers</p>\n</div></div></div><div id='method-applyPresetFilters' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-applyPresetFilters' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-applyPresetFilters' class='name expandable'>applyPresetFilters</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Applies preset filters from the configuration\nto the grid. ...</div><div class='long'><p>Applies preset filters from the configuration\nto the grid.</p>\n</div></div></div><div id='method-applyStoreToGrid' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-applyStoreToGrid' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-applyStoreToGrid' class='name expandable'>applyStoreToGrid</a>( <span class='pre'>viewModel</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Dynamically apply a store to the grid based on the gridStoreType\nconfig option. ...</div><div class='long'><p>Dynamically apply a store to the grid based on the gridStoreType\nconfig option. Also set the hidden grid vector layer to be associated\nwith the cmv_spatial_query_button</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>viewModel</span> : Ext.app.ViewModel <div class='sub-desc'><p>The ViewModel</p>\n</div></li></ul></div></div></div><div id='method-clearFilters' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-clearFilters' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-clearFilters' class='name expandable'>clearFilters</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Clear both the grid filters and any spatial filter. ...</div><div class='long'><p>Clear both the grid filters and any spatial filter.\nThis will cause the store to reload.</p>\n</div></div></div><div id='method-createNumberFilterValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-createNumberFilterValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-createNumberFilterValue' class='name expandable'>createNumberFilterValue</a>( <span class='pre'>operator, value</span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Create a value object needed for number filters. ...</div><div class='long'><p>Create a value object needed for number filters.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>operator</span> : string<div class='sub-desc'><p>The userdefined operator. Allowed values: '=', '&lt;' and '>'</p>\n</div></li><li><span class='pre'>value</span> : number<div class='sub-desc'><p>The numerical value to compare</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>The value object for the filter</p>\n</div></li></ul></div></div></div><div id='method-exportToExcel' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-exportToExcel' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-exportToExcel' class='name expandable'>exportToExcel</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Export the current records in the grid to Excel ...</div><div class='long'><p>Export the current records in the grid to Excel</p>\n</div></div></div><div id='method-exportToShapefile' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-exportToShapefile' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-exportToShapefile' class='name expandable'>exportToShapefile</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Export the current records in the grid to a zipped shapefile ...</div><div class='long'><p>Export the current records in the grid to a zipped shapefile</p>\n</div></div></div><div id='method-getLayerByKey' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-getLayerByKey' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-getLayerByKey' class='name expandable'>getLayerByKey</a>( <span class='pre'>key</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Find a layer in the map based on its unique and custom layerKey\nproperty ...</div><div class='long'><p>Find a layer in the map based on its unique and custom layerKey\nproperty</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : string<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getOlLayer' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-getOlLayer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-getOlLayer' class='name expandable'>getOlLayer</a>( <span class='pre'></span> ) : ol.layer.Base<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns the layer of the grid. ...</div><div class='long'><p>Returns the layer of the grid.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>ol.layer.Base</span><div class='sub-desc'><p>The grid's layer</p>\n</div></li></ul></div></div></div><div id='method-getVisibleColumns' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-getVisibleColumns' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-getVisibleColumns' class='name expandable'>getVisibleColumns</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Whenever columns are shown or hidden update\nthe WFS propertyName so only data to\nbe displayed is returned. ...</div><div class='long'><p>Whenever columns are shown or hidden update\nthe WFS propertyName so only data to\nbe displayed is returned. The idProperty will\nalways be returned even if the column is hidden.</p>\n</div></div></div><div id='method-initViewModel' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-initViewModel' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-initViewModel' class='name expandable'>initViewModel</a>( <span class='pre'>viewModel</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>viewModel</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-onClearSort' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-onClearSort' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-onClearSort' class='name expandable'>onClearSort</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Clear any sorters on the store ...</div><div class='long'><p>Clear any sorters on the store</p>\n</div></div></div><div id='method-onColumnHide' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-onColumnHide' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-onColumnHide' class='name expandable'>onColumnHide</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-onColumnShow' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-onColumnShow' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-onColumnShow' class='name expandable'>onColumnShow</a>( <span class='pre'>ct, column</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>ct</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>column</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-onColumnsReconfigure' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-onColumnsReconfigure' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-onColumnsReconfigure' class='name expandable'>onColumnsReconfigure</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-onIdFilterSet' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-onIdFilterSet' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-onIdFilterSet' class='name expandable'>onIdFilterSet</a>( <span class='pre'>idFilter</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets an ExtJS \"in\" filter for feature IDs which has to be applied to the\nunderlying WFS request. ...</div><div class='long'><p>Sets an ExtJS \"in\" filter for feature IDs which has to be applied to the\nunderlying WFS request.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>idFilter</span> : Ext.util.Filter<div class='sub-desc'><p>Filter object with FIDs</p>\n</div></li></ul></div></div></div><div id='method-onItemContextMenu' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-onItemContextMenu' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-onItemContextMenu' class='name expandable'>onItemContextMenu</a>( <span class='pre'>grid, record, item, index, evt</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Open a row-level context-menu with a Zoom to Feature option ...</div><div class='long'><p>Open a row-level context-menu with a Zoom to Feature option</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>grid</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>record</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>item</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>index</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>evt</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-onRowDblClick' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-onRowDblClick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-onRowDblClick' class='name expandable'>onRowDblClick</a>( <span class='pre'>grid, record</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>If there is an edit / view window for individual records\nin the grid then open it with this function ...</div><div class='long'><p>If there is an edit / view window for individual records\nin the grid then open it with this function</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>grid</span> : Ext.grid.View<div class='sub-desc'>\n</div></li><li><span class='pre'>record</span> : Ext.data.Model<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-onShow' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-onShow' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-onShow' class='name expandable'>onShow</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Template method for Ext.Component that\ncan be overridden ...</div><div class='long'><p>Template method for Ext.Component that\ncan be overridden</p>\n</div></div></div><div id='method-onSpatialFilter' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-onSpatialFilter' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-onSpatialFilter' class='name expandable'>onSpatialFilter</a>( <span class='pre'>spatialFilter</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Store the spatial filter as a property of this class\nthen force a reload of the grid store with the new filter\nFinall...</div><div class='long'><p>Store the spatial filter as a property of this class\nthen force a reload of the grid store with the new filter\nFinally apply all filters to any associated layers.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>spatialFilter</span> : Ext.util.Filter<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-onWfsStoreAfterLoad' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-onWfsStoreAfterLoad' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-onWfsStoreAfterLoad' class='name expandable'>onWfsStoreAfterLoad</a>( <span class='pre'>store, features, success</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Hide the loading mask when the store has loaded ...</div><div class='long'><p>Hide the loading mask when the store has loaded</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>store</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>features</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>success</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-onWfsStoreBeforeLoad' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-onWfsStoreBeforeLoad' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-onWfsStoreBeforeLoad' class='name expandable'>onWfsStoreBeforeLoad</a>( <span class='pre'>store, params</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Apply any spatial filter to the store request, and convert all\nExtJS filters to WFS filters. ...</div><div class='long'><p>Apply any spatial filter to the store request, and convert all\nExtJS filters to WFS filters.\nAlso set a loading mask on the grid.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>store</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>params</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-refreshStore' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-refreshStore' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-refreshStore' class='name expandable'>refreshStore</a>( <span class='pre'>clearPaging</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Force a reload of the grid store ...</div><div class='long'><p>Force a reload of the grid store</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>clearPaging</span> : Boolean<div class='sub-desc'><p>True to clear paging parameters</p>\n</div></li></ul></div></div></div><div id='method-resetFilters' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-resetFilters' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-resetFilters' class='name expandable'>resetFilters</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Resets all filters without reloading the store. ...</div><div class='long'><p>Resets all filters without reloading the store.\nIn case a direct reload of the store is needed use <a href=\"#!/api/CpsiMapview.controller.grid.Grid-method-clearFilters\" rel=\"CpsiMapview.controller.grid.Grid-method-clearFilters\" class=\"docClass\">clearFilters</a>.</p>\n</div></div></div><div id='method-toggleLayerVisibility' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-toggleLayerVisibility' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-toggleLayerVisibility' class='name expandable'>toggleLayerVisibility</a>( <span class='pre'>show</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Hide and show the map layer used to highlight selected features\nwith the grid. ...</div><div class='long'><p>Hide and show the map layer used to highlight selected features\nwith the grid.\nAlthough the layer has no styling we need to hide\nany selections which are visible</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>show</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-togglePaging' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-togglePaging' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-togglePaging' class='name expandable'>togglePaging</a>( <span class='pre'>checkBox, checked</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Enable and disable paging for the grid. ...</div><div class='long'><p>Enable and disable paging for the grid.\nDisabling paging allows all records to be loaded into the\ngrid for an Excel export. Enabling paging improves load\nperformance.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>checkBox</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>checked</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-updateAssociatedLayers' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-updateAssociatedLayers' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-updateAssociatedLayers' class='name expandable'>updateAssociatedLayers</a>( <span class='pre'>force</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Applies both attribute and spatial filters to\nany associated WMS and vector layer and reloads both\nIf filters have no...</div><div class='long'><p>Applies both attribute and spatial filters to\nany associated WMS and vector layer and reloads both\nIf filters have not been modified the WMS layer is not updated unless forced</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>force</span> : Boolean<div class='sub-desc'><p>True to force a WMS refresh (required if underlying data has changed)</p>\n</div></li></ul></div></div></div><div id='method-zoomToFeature' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.grid.Grid'>CpsiMapview.controller.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-controller-grid-Grid-method-zoomToFeature' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.Grid-method-zoomToFeature' class='name expandable'>zoomToFeature</a>( <span class='pre'>feature, map</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Zoom the map to the selected feature with a buffer ...</div><div class='long'><p>Zoom the map to the selected feature with a buffer</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>feature</span> : ol.Feature<div class='sub-desc'>\n</div></li><li><span class='pre'>map</span> : ol.Map<div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});