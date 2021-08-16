Ext.data.JsonP.CpsiMapview_util_ZoomerMixin({"tagname":"class","name":"CpsiMapview.util.ZoomerMixin","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"ZoomerMixin.js","href":"ZoomerMixin.html#CpsiMapview-util-ZoomerMixin"}],"aliases":{},"alternateClassNames":[],"extends":"Ext.Mixin","mixins":[],"requires":["BasiGX.util.Map"],"uses":[],"members":[{"name":"zoomDefaults","tagname":"property","owner":"CpsiMapview.util.ZoomerMixin","id":"property-zoomDefaults","meta":{"private":true}},{"name":"zoomMap","tagname":"method","owner":"CpsiMapview.util.ZoomerMixin","id":"method-zoomMap","meta":{}},{"name":"zoomToBounds","tagname":"method","owner":"CpsiMapview.util.ZoomerMixin","id":"method-zoomToBounds","meta":{}},{"name":"zoomToExtentUsingService","tagname":"method","owner":"CpsiMapview.util.ZoomerMixin","id":"method-zoomToExtentUsingService","meta":{}},{"name":"zoomToRecordExtent","tagname":"method","owner":"CpsiMapview.util.ZoomerMixin","id":"method-zoomToRecordExtent","meta":{}}],"code_type":"ext_define","id":"class-CpsiMapview.util.ZoomerMixin","component":false,"superclasses":["Ext.Mixin"],"subclasses":[],"mixedInto":["CpsiMapview.form.ControllerMixin"],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.Mixin<div class='subclass '><strong>CpsiMapview.util.ZoomerMixin</strong></div></div><h4>Requires</h4><div class='dependency'>BasiGX.util.Map</div><h4>Mixed into</h4><div class='dependency'><a href='#!/api/CpsiMapview.form.ControllerMixin' rel='CpsiMapview.form.ControllerMixin' class='docClass'>CpsiMapview.form.ControllerMixin</a></div><h4>Files</h4><div class='dependency'><a href='source/ZoomerMixin.html#CpsiMapview-util-ZoomerMixin' target='_blank'>ZoomerMixin.js</a></div></pre><div class='doc-contents'><p>A mixin to allow zooming to extents and extents\nreturned in a model</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-zoomDefaults' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ZoomerMixin'>CpsiMapview.util.ZoomerMixin</span><br/><a href='source/ZoomerMixin.html#CpsiMapview-util-ZoomerMixin-property-zoomDefaults' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ZoomerMixin-property-zoomDefaults' class='name expandable'>zoomDefaults</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>{duration: 20}</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-zoomMap' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ZoomerMixin'>CpsiMapview.util.ZoomerMixin</span><br/><a href='source/ZoomerMixin.html#CpsiMapview-util-ZoomerMixin-method-zoomMap' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ZoomerMixin-method-zoomMap' class='name expandable'>zoomMap</a>( <span class='pre'>extent, options</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Zoom the map object to the extent of the layer\nSee https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#f...</div><div class='long'><p>Zoom the map object to the extent of the layer\nSee https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#fit\nfor options</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>extent</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>options</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-zoomToBounds' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ZoomerMixin'>CpsiMapview.util.ZoomerMixin</span><br/><a href='source/ZoomerMixin.html#CpsiMapview-util-ZoomerMixin-method-zoomToBounds' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ZoomerMixin-method-zoomToBounds' class='name expandable'>zoomToBounds</a>( <span class='pre'>data</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Zoom to extent using a JSON object with bbox in epsg:3857 ...</div><div class='long'><p>Zoom to extent using a JSON object with bbox in epsg:3857</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-zoomToExtentUsingService' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ZoomerMixin'>CpsiMapview.util.ZoomerMixin</span><br/><a href='source/ZoomerMixin.html#CpsiMapview-util-ZoomerMixin-method-zoomToExtentUsingService' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ZoomerMixin-method-zoomToExtentUsingService' class='name expandable'>zoomToExtentUsingService</a>( <span class='pre'>url, id</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Zoom using a bbox provided by the .NET services ...</div><div class='long'><p>Zoom using a bbox provided by the .NET services</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>url</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>id</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-zoomToRecordExtent' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ZoomerMixin'>CpsiMapview.util.ZoomerMixin</span><br/><a href='source/ZoomerMixin.html#CpsiMapview-util-ZoomerMixin-method-zoomToRecordExtent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ZoomerMixin-method-zoomToRecordExtent' class='name expandable'>zoomToRecordExtent</a>( <span class='pre'>options</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Zoom the map object to the extent of the layer\nSee https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#f...</div><div class='long'><p>Zoom the map object to the extent of the layer\nSee https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#fit\nfor options</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>options</span> : Object<div class='sub-desc'></div></li></ul></div></div></div></div></div></div></div>","meta":{}});