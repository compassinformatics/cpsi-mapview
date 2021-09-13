Ext.data.JsonP.CpsiMapview_view_toolbar_MapTools({"tagname":"class","name":"CpsiMapview.view.toolbar.MapTools","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"MapTools.js","href":"MapTools.html#CpsiMapview-view-toolbar-MapTools"}],"aliases":{"widget":["cmv_maptools"]},"alternateClassNames":[],"extends":"Ext.toolbar.Toolbar","mixins":[],"requires":["BasiGX.view.button.History","BasiGX.view.button.Measure","BasiGX.view.button.ZoomIn","BasiGX.view.button.ZoomOut","BasiGX.view.button.ZoomToExtent","CpsiMapview.controller.button.MeasureButtonController","CpsiMapview.controller.toolbar.MapTools","CpsiMapview.model.button.MeasureButton","CpsiMapview.view.button.DigitizeButton","CpsiMapview.view.button.StreetViewTool","CpsiMapview.view.combo.Gazetteer","CpsiMapview.view.lineSliceGridExample.LineSliceGridButton","CpsiMapview.view.panel.NumericAttributeSlider","CpsiMapview.view.panel.TimeSlider","Ext.container.ButtonGroup","GeoExt.form.field.GeocoderComboBox"],"uses":[],"members":[{"name":"controller","tagname":"property","owner":"CpsiMapview.view.toolbar.MapTools","id":"property-controller","meta":{"private":true}},{"name":"dock","tagname":"property","owner":"CpsiMapview.view.toolbar.MapTools","id":"property-dock","meta":{"private":true}},{"name":"items","tagname":"property","owner":"CpsiMapview.view.toolbar.MapTools","id":"property-items","meta":{}}],"code_type":"ext_define","id":"class-CpsiMapview.view.toolbar.MapTools","component":false,"superclasses":["Ext.toolbar.Toolbar"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.toolbar.Toolbar<div class='subclass '><strong>CpsiMapview.view.toolbar.MapTools</strong></div></div><h4>Requires</h4><div class='dependency'>BasiGX.view.button.History</div><div class='dependency'>BasiGX.view.button.Measure</div><div class='dependency'>BasiGX.view.button.ZoomIn</div><div class='dependency'>BasiGX.view.button.ZoomOut</div><div class='dependency'>BasiGX.view.button.ZoomToExtent</div><div class='dependency'><a href='#!/api/CpsiMapview.controller.button.MeasureButtonController' rel='CpsiMapview.controller.button.MeasureButtonController' class='docClass'>CpsiMapview.controller.button.MeasureButtonController</a></div><div class='dependency'><a href='#!/api/CpsiMapview.controller.toolbar.MapTools' rel='CpsiMapview.controller.toolbar.MapTools' class='docClass'>CpsiMapview.controller.toolbar.MapTools</a></div><div class='dependency'><a href='#!/api/CpsiMapview.model.button.MeasureButton' rel='CpsiMapview.model.button.MeasureButton' class='docClass'>CpsiMapview.model.button.MeasureButton</a></div><div class='dependency'><a href='#!/api/CpsiMapview.view.button.DigitizeButton' rel='CpsiMapview.view.button.DigitizeButton' class='docClass'>CpsiMapview.view.button.DigitizeButton</a></div><div class='dependency'><a href='#!/api/CpsiMapview.view.button.StreetViewTool' rel='CpsiMapview.view.button.StreetViewTool' class='docClass'>CpsiMapview.view.button.StreetViewTool</a></div><div class='dependency'><a href='#!/api/CpsiMapview.view.combo.Gazetteer' rel='CpsiMapview.view.combo.Gazetteer' class='docClass'>CpsiMapview.view.combo.Gazetteer</a></div><div class='dependency'>CpsiMapview.view.lineSliceGridExample.LineSliceGridButton</div><div class='dependency'><a href='#!/api/CpsiMapview.view.panel.NumericAttributeSlider' rel='CpsiMapview.view.panel.NumericAttributeSlider' class='docClass'>CpsiMapview.view.panel.NumericAttributeSlider</a></div><div class='dependency'><a href='#!/api/CpsiMapview.view.panel.TimeSlider' rel='CpsiMapview.view.panel.TimeSlider' class='docClass'>CpsiMapview.view.panel.TimeSlider</a></div><div class='dependency'>Ext.container.ButtonGroup</div><div class='dependency'>GeoExt.form.field.GeocoderComboBox</div><h4>Files</h4><div class='dependency'><a href='source/MapTools.html#CpsiMapview-view-toolbar-MapTools' target='_blank'>MapTools.js</a></div></pre><div class='doc-contents'><p>Toolbar offering map tools, like zoom or measure.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-controller' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.toolbar.MapTools'>CpsiMapview.view.toolbar.MapTools</span><br/><a href='source/MapTools.html#CpsiMapview-view-toolbar-MapTools-property-controller' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.toolbar.MapTools-property-controller' class='name expandable'>controller</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&#39;cmv_maptools&#39;</code></p></div></div></div><div id='property-dock' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.toolbar.MapTools'>CpsiMapview.view.toolbar.MapTools</span><br/><a href='source/MapTools.html#CpsiMapview-view-toolbar-MapTools-property-dock' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.toolbar.MapTools-property-dock' class='name expandable'>dock</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&#39;top&#39;</code></p></div></div></div><div id='property-items' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.toolbar.MapTools'>CpsiMapview.view.toolbar.MapTools</span><br/><a href='source/MapTools.html#CpsiMapview-view-toolbar-MapTools-property-items' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.toolbar.MapTools-property-items' class='name expandable'>items</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>These would typically be overridden in a client application</p>\n</div><div class='long'><p>These would typically be overridden in a client application</p>\n</div></div></div></div></div></div></div>","meta":{}});