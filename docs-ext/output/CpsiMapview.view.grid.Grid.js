Ext.data.JsonP.CpsiMapview_view_grid_Grid({"tagname":"class","name":"CpsiMapview.view.grid.Grid","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"Grid.js","href":"Grid.html#CpsiMapview-view-grid-Grid"}],"aliases":{"widget":["cmv_grid"]},"alternateClassNames":[],"extends":"Ext.grid.Panel","mixins":[],"requires":["BasiGX.util.Layer","CpsiMapview.controller.grid.Grid","CpsiMapview.view.button.FeatureSelectionButton","CpsiMapview.view.button.SpatialQueryButton","Ext.toolbar.Paging","GeoExt.selection.FeatureModel","GeoExt.toolbar.WfsPaging"],"uses":[],"members":[{"name":"exportFileName","tagname":"cfg","owner":"CpsiMapview.view.grid.Grid","id":"cfg-exportFileName","meta":{}},{"name":"exportTitle","tagname":"cfg","owner":"CpsiMapview.view.grid.Grid","id":"cfg-exportTitle","meta":{}},{"name":"extentBuffer","tagname":"cfg","owner":"CpsiMapview.view.grid.Grid","id":"cfg-extentBuffer","meta":{}},{"name":"bind","tagname":"property","owner":"CpsiMapview.view.grid.Grid","id":"property-bind","meta":{"private":true}},{"name":"controller","tagname":"property","owner":"CpsiMapview.view.grid.Grid","id":"property-controller","meta":{"private":true}},{"name":"dockedItems","tagname":"property","owner":"CpsiMapview.view.grid.Grid","id":"property-dockedItems","meta":{}},{"name":"listeners","tagname":"property","owner":"CpsiMapview.view.grid.Grid","id":"property-listeners","meta":{}},{"name":"plugins","tagname":"property","owner":"CpsiMapview.view.grid.Grid","id":"property-plugins","meta":{"private":true}},{"name":"selModel","tagname":"property","owner":"CpsiMapview.view.grid.Grid","id":"property-selModel","meta":{"private":true}},{"name":"viewConfig","tagname":"property","owner":"CpsiMapview.view.grid.Grid","id":"property-viewConfig","meta":{"private":true}},{"name":"viewModel","tagname":"property","owner":"CpsiMapview.view.grid.Grid","id":"property-viewModel","meta":{"private":true}},{"name":"width","tagname":"property","owner":"CpsiMapview.view.grid.Grid","id":"property-width","meta":{"private":true}}],"code_type":"ext_define","id":"class-CpsiMapview.view.grid.Grid","component":false,"superclasses":["Ext.grid.Panel"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.grid.Panel<div class='subclass '><strong>CpsiMapview.view.grid.Grid</strong></div></div><h4>Requires</h4><div class='dependency'>BasiGX.util.Layer</div><div class='dependency'><a href='#!/api/CpsiMapview.controller.grid.Grid' rel='CpsiMapview.controller.grid.Grid' class='docClass'>CpsiMapview.controller.grid.Grid</a></div><div class='dependency'><a href='#!/api/CpsiMapview.view.button.FeatureSelectionButton' rel='CpsiMapview.view.button.FeatureSelectionButton' class='docClass'>CpsiMapview.view.button.FeatureSelectionButton</a></div><div class='dependency'><a href='#!/api/CpsiMapview.view.button.SpatialQueryButton' rel='CpsiMapview.view.button.SpatialQueryButton' class='docClass'>CpsiMapview.view.button.SpatialQueryButton</a></div><div class='dependency'>Ext.toolbar.Paging</div><div class='dependency'>GeoExt.selection.FeatureModel</div><div class='dependency'>GeoExt.toolbar.WfsPaging</div><h4>Files</h4><div class='dependency'><a href='source/Grid.html#CpsiMapview-view-grid-Grid' target='_blank'>Grid.js</a></div></pre><div class='doc-contents'><p>Base class for WFS-based data grids with filtering\nand Excel exports.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-exportFileName' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.grid.Grid'>CpsiMapview.view.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-view-grid-Grid-cfg-exportFileName' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.grid.Grid-cfg-exportFileName' class='name expandable'>exportFileName</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The filename of the Excel export ...</div><div class='long'><p>The filename of the Excel export</p>\n<p>Defaults to: <code>&#39;RecordsExport.xlsx&#39;</code></p></div></div></div><div id='cfg-exportTitle' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.grid.Grid'>CpsiMapview.view.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-view-grid-Grid-cfg-exportTitle' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.grid.Grid-cfg-exportTitle' class='name expandable'>exportTitle</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The title added to the Excel document ...</div><div class='long'><p>The title added to the Excel document</p>\n<p>Defaults to: <code>&#39;Records Export&#39;</code></p></div></div></div><div id='cfg-extentBuffer' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.grid.Grid'>CpsiMapview.view.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-view-grid-Grid-cfg-extentBuffer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.grid.Grid-cfg-extentBuffer' class='name expandable'>extentBuffer</a> : Number<span class=\"signature\"></span></div><div class='description'><div class='short'>The distance used to buffer a feature when the zoomToFeature\nfunction is used ...</div><div class='long'><p>The distance used to buffer a feature when the zoomToFeature\nfunction is used</p>\n<p>Defaults to: <code>100</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-bind' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.grid.Grid'>CpsiMapview.view.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-view-grid-Grid-property-bind' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.grid.Grid-property-bind' class='name expandable'>bind</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>{store: &#39;{gridstore}&#39;}</code></p></div></div></div><div id='property-controller' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.grid.Grid'>CpsiMapview.view.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-view-grid-Grid-property-controller' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.grid.Grid-property-controller' class='name expandable'>controller</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&#39;cmv_grid&#39;</code></p></div></div></div><div id='property-dockedItems' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.grid.Grid'>CpsiMapview.view.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-view-grid-Grid-property-dockedItems' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.grid.Grid-property-dockedItems' class='name expandable'>dockedItems</a> : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>Collection of tools and buttons at the top of the grid ...</div><div class='long'><p>Collection of tools and buttons at the top of the grid</p>\n<p>Defaults to: <code>[{xtype: &#39;toolbar&#39;, dock: &#39;top&#39;, items: [{xtype: &#39;button&#39;, text: &#39;Clear Filters&#39;, glyph: &#39;f0b0@FontAwesome&#39;, handler: &#39;clearFilters&#39;, bind: {hidden: &#39;{!clearFiltersVisible}&#39;}}, {xtype: &#39;button&#39;, text: &#39;Clear Sorting&#39;, glyph: &#39;f039@FontAwesome&#39;, handler: &#39;onClearSort&#39;}, {xtype: &#39;button&#39;, text: &#39;Apply Preset Filters&#39;, glyph: &#39;f005@FontAwesome&#39;, handler: &#39;applyPresetFilters&#39;, bind: {hidden: &#39;{!usePresetFilters}&#39;}}, &#39;-&gt;&#39;, {xtype: &#39;cmv_spatial_query_button&#39;, drawGeometryType: &#39;Polygon&#39;, text: &#39;Select by Shape&#39;, spatialOperator: &#39;intersect&#39;, toggleGroup: &#39;map&#39;, triggerWfsRequest: false, displayPermanently: true, glyph: &#39;xf044@FontAwesome&#39;, bind: {hidden: &#39;{!useSimpleSelection}&#39;}, listeners: {&#39;cmv-spatial-query-filter&#39;: &#39;onSpatialFilter&#39;}}, {xtype: &#39;buttongroup&#39;, bind: {hidden: &#39;{!useAdvancedSelection}&#39;}, items: [{xtype: &#39;cmv_spatial_query_button&#39;, drawGeometryType: &#39;Polygon&#39;, text: &#39;Select by Shape&#39;, spatialOperator: &#39;intersect&#39;, toggleGroup: &#39;map&#39;, triggerWfsRequest: false, displayPermanently: true, glyph: &#39;xf044@FontAwesome&#39;, listeners: {&#39;cmv-spatial-query-filter&#39;: &#39;onSpatialFilter&#39;}}, {xtype: &#39;cmv_feature_selection_button&#39;, triggerWfsRequest: false, allowMultiple: true, toggleGroup: &#39;map&#39;, bind: {vectorLayerKey: &#39;{featureSelectionLayerKey}&#39;}, glyph: &#39;xf245@FontAwesome&#39;, listeners: {&#39;cmv-reset-grid-filters&#39;: &#39;resetFilters&#39;, &#39;cmv-id-filter-set&#39;: &#39;onIdFilterSet&#39;}}]}, {xtype: &#39;button&#39;, bind: {pressed: &#39;{isGroupEditingEnabled}&#39;, hidden: &#39;{!isGroupEditingVisible}&#39;}, text: &#39;Group Edit&#39;, enableToggle: true, glyph: &#39;xf040@FontAwesome&#39;, toggleHandler: &#39;onGroupEditToggle&#39;}, {xtype: &#39;button&#39;, text: &#39;Export to Excel&#39;, glyph: &#39;xf1c3@FontAwesome&#39;, handler: &#39;exportToExcel&#39;, bind: {hidden: &#39;{!exportExcelVisible}&#39;}}, {xtype: &#39;button&#39;, text: &#39;Export to Shapefile&#39;, glyph: &#39;eaa2@font-gis&#39;, handler: &#39;exportToShapefile&#39;, bind: {hidden: &#39;{!exportShapefileVisible}&#39;}}]}, {xtype: &#39;toolbar&#39;, dock: &#39;bottom&#39;, items: [{xtype: &#39;gx_wfspaging_toolbar&#39;, displayInfo: true, bind: {store: &#39;{gridstore}&#39;}}, {xtype: &#39;checkbox&#39;, itemId: &#39;pagingCheckbox&#39;, checked: true, boxLabel: &#39;Page Records?&#39;, handler: &#39;togglePaging&#39;}]}]</code></p></div></div></div><div id='property-listeners' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.grid.Grid'>CpsiMapview.view.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-view-grid-Grid-property-listeners' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.grid.Grid-property-listeners' class='name expandable'>listeners</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Functions attached to various listeners on the grid ...</div><div class='long'><p>Functions attached to various listeners on the grid</p>\n<p>Defaults to: <code>{filterchange: &#39;updateAssociatedLayers&#39;, itemcontextmenu: &#39;onItemContextMenu&#39;, columnhide: &#39;onColumnHide&#39;, columnshow: &#39;onColumnShow&#39;, rowdblclick: &#39;onRowDblClick&#39;, reconfigure: &#39;onColumnsReconfigure&#39;, clearfilters: &#39;clearFilters&#39;, applypresetfilters: &#39;applyPresetFilters&#39;}</code></p></div></div></div><div id='property-plugins' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.grid.Grid'>CpsiMapview.view.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-view-grid-Grid-property-plugins' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.grid.Grid-property-plugins' class='name expandable'>plugins</a> : Array<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>[&#39;gridfilters&#39;]</code></p></div></div></div><div id='property-selModel' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.grid.Grid'>CpsiMapview.view.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-view-grid-Grid-property-selModel' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.grid.Grid-property-selModel' class='name expandable'>selModel</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='property-viewConfig' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.grid.Grid'>CpsiMapview.view.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-view-grid-Grid-property-viewConfig' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.grid.Grid-property-viewConfig' class='name expandable'>viewConfig</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>{loadingText: &#39;Loading records&#39;, enableTextSelection: true}</code></p></div></div></div><div id='property-viewModel' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.grid.Grid'>CpsiMapview.view.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-view-grid-Grid-property-viewModel' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.grid.Grid-property-viewModel' class='name expandable'>viewModel</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&#39;cmv_grid&#39;</code></p></div></div></div><div id='property-width' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.grid.Grid'>CpsiMapview.view.grid.Grid</span><br/><a href='source/Grid.html#CpsiMapview-view-grid-Grid-property-width' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.grid.Grid-property-width' class='name expandable'>width</a> : Number<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>1090</code></p></div></div></div></div></div></div></div>","meta":{}});