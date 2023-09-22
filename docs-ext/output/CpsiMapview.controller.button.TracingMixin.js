Ext.data.JsonP.CpsiMapview_controller_button_TracingMixin({"tagname":"class","name":"CpsiMapview.controller.button.TracingMixin","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"TracingMixin.js","href":"TracingMixin.html#CpsiMapview-controller-button-TracingMixin"}],"aliases":{},"alternateClassNames":[],"extends":"Ext.Mixin","mixins":[],"requires":["BasiGX.util.Layer","CpsiMapview.util.Tracing"],"uses":[],"members":[{"name":"getSnapCoordinateInteraction","tagname":"property","owner":"CpsiMapview.controller.button.TracingMixin","id":"property-getSnapCoordinateInteraction","meta":{}},{"name":"lastSnappedCoord","tagname":"property","owner":"CpsiMapview.controller.button.TracingMixin","id":"property-lastSnappedCoord","meta":{}},{"name":"previewStyle","tagname":"property","owner":"CpsiMapview.controller.button.TracingMixin","id":"property-previewStyle","meta":{}},{"name":"cleanupTracing","tagname":"method","owner":"CpsiMapview.controller.button.TracingMixin","id":"method-cleanupTracing","meta":{}},{"name":"initTracing","tagname":"method","owner":"CpsiMapview.controller.button.TracingMixin","id":"method-initTracing","meta":{}},{"name":"onTracingDrawEnd","tagname":"method","owner":"CpsiMapview.controller.button.TracingMixin","id":"method-onTracingDrawEnd","meta":{}},{"name":"onTracingDrawStart","tagname":"method","owner":"CpsiMapview.controller.button.TracingMixin","id":"method-onTracingDrawStart","meta":{}},{"name":"onTracingMapClick","tagname":"method","owner":"CpsiMapview.controller.button.TracingMixin","id":"method-onTracingMapClick","meta":{}},{"name":"onTracingPointerMove","tagname":"method","owner":"CpsiMapview.controller.button.TracingMixin","id":"method-onTracingPointerMove","meta":{}},{"name":"setNewTracingOnInteriorStartEndTouch","tagname":"method","owner":"CpsiMapview.controller.button.TracingMixin","id":"method-setNewTracingOnInteriorStartEndTouch","meta":{}},{"name":"setNewTracingOnStartEndInteriorTouch","tagname":"method","owner":"CpsiMapview.controller.button.TracingMixin","id":"method-setNewTracingOnStartEndInteriorTouch","meta":{}},{"name":"setNewTracingOnStartEndTouch","tagname":"method","owner":"CpsiMapview.controller.button.TracingMixin","id":"method-setNewTracingOnStartEndTouch","meta":{}},{"name":"trackSnappedCoords","tagname":"method","owner":"CpsiMapview.controller.button.TracingMixin","id":"method-trackSnappedCoords","meta":{}},{"name":"updateTraceableFeature","tagname":"method","owner":"CpsiMapview.controller.button.TracingMixin","id":"method-updateTraceableFeature","meta":{}}],"code_type":"ext_define","id":"class-CpsiMapview.controller.button.TracingMixin","short_doc":"A mixin to add tracing functionality to a drawing tool. ...","component":false,"superclasses":["Ext.Mixin"],"subclasses":[],"mixedInto":["CpsiMapview.controller.button.DrawingButtonController"],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.Mixin<div class='subclass '><strong>CpsiMapview.controller.button.TracingMixin</strong></div></div><h4>Requires</h4><div class='dependency'>BasiGX.util.Layer</div><div class='dependency'><a href='#!/api/CpsiMapview.util.Tracing' rel='CpsiMapview.util.Tracing' class='docClass'>CpsiMapview.util.Tracing</a></div><h4>Mixed into</h4><div class='dependency'><a href='#!/api/CpsiMapview.controller.button.DrawingButtonController' rel='CpsiMapview.controller.button.DrawingButtonController' class='docClass'>CpsiMapview.controller.button.DrawingButtonController</a></div><h4>Files</h4><div class='dependency'><a href='source/TracingMixin.html#CpsiMapview-controller-button-TracingMixin' target='_blank'>TracingMixin.js</a></div></pre><div class='doc-contents'><p>A mixin to add tracing functionality to a drawing tool.</p>\n\n<p>The basic functionality is taken from the official OpenLayers example:\nhttps://openlayers.org/en/latest/examples/tracing.html</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-getSnapCoordinateInteraction' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.TracingMixin'>CpsiMapview.controller.button.TracingMixin</span><br/><a href='source/TracingMixin.html#CpsiMapview-controller-button-TracingMixin-property-getSnapCoordinateInteraction' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.TracingMixin-property-getSnapCoordinateInteraction' class='name expandable'>getSnapCoordinateInteraction</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Interaction to track and populate lastSnappedCoord</p>\n</div><div class='long'><p>Interaction to track and populate lastSnappedCoord</p>\n</div></div></div><div id='property-lastSnappedCoord' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.TracingMixin'>CpsiMapview.controller.button.TracingMixin</span><br/><a href='source/TracingMixin.html#CpsiMapview-controller-button-TracingMixin-property-lastSnappedCoord' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.TracingMixin-property-lastSnappedCoord' class='name expandable'>lastSnappedCoord</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Used to store the position of the last mouse coord, taking into account snapping</p>\n</div><div class='long'><p>Used to store the position of the last mouse coord, taking into account snapping</p>\n</div></div></div><div id='property-previewStyle' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.TracingMixin'>CpsiMapview.controller.button.TracingMixin</span><br/><a href='source/TracingMixin.html#CpsiMapview-controller-button-TracingMixin-property-previewStyle' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.TracingMixin-property-previewStyle' class='name expandable'>previewStyle</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>The style of the preview line during tracing.</p>\n</div><div class='long'><p>The style of the preview line during tracing.</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-cleanupTracing' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.TracingMixin'>CpsiMapview.controller.button.TracingMixin</span><br/><a href='source/TracingMixin.html#CpsiMapview-controller-button-TracingMixin-method-cleanupTracing' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.TracingMixin-method-cleanupTracing' class='name expandable'>cleanupTracing</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Remove listeners and layers ...</div><div class='long'><p>Remove listeners and layers</p>\n</div></div></div><div id='method-initTracing' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.TracingMixin'>CpsiMapview.controller.button.TracingMixin</span><br/><a href='source/TracingMixin.html#CpsiMapview-controller-button-TracingMixin-method-initTracing' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.TracingMixin-method-initTracing' class='name expandable'>initTracing</a>( <span class='pre'>tracingLayerKeys, drawInteraction, [showTraceableEdges]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Enhances drawing functionality by adding tracing to it. ...</div><div class='long'><p>Enhances drawing functionality by adding tracing to it.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>tracingLayerKeys</span> : String[]<div class='sub-desc'><p>The keys of the layers to trace</p>\n</div></li><li><span class='pre'>drawInteraction</span> : ol.interaction.Draw<div class='sub-desc'><p>draw interaction to attach the tracing on</p>\n</div></li><li><span class='pre'>showTraceableEdges</span> : Boolean (optional)<div class='sub-desc'><p>If the traceable edges shall be shown (useful for debugging)</p>\n<p>Defaults to: <code>false</code></p></div></li></ul></div></div></div><div id='method-onTracingDrawEnd' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.TracingMixin'>CpsiMapview.controller.button.TracingMixin</span><br/><a href='source/TracingMixin.html#CpsiMapview-controller-button-TracingMixin-method-onTracingDrawEnd' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.TracingMixin-method-onTracingDrawEnd' class='name expandable'>onTracingDrawEnd</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the variable 'me.tracingActive' to false. ...</div><div class='long'><p>Sets the variable 'me.tracingActive' to false.</p>\n</div></div></div><div id='method-onTracingDrawStart' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.TracingMixin'>CpsiMapview.controller.button.TracingMixin</span><br/><a href='source/TracingMixin.html#CpsiMapview-controller-button-TracingMixin-method-onTracingDrawStart' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.TracingMixin-method-onTracingDrawStart' class='name expandable'>onTracingDrawStart</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the variable 'me.tracingActive' to true. ...</div><div class='long'><p>Sets the variable 'me.tracingActive' to true.</p>\n</div></div></div><div id='method-onTracingMapClick' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.TracingMixin'>CpsiMapview.controller.button.TracingMixin</span><br/><a href='source/TracingMixin.html#CpsiMapview-controller-button-TracingMixin-method-onTracingMapClick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.TracingMixin-method-onTracingMapClick' class='name expandable'>onTracingMapClick</a>( <span class='pre'>event</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Listen to click to start and end the tracing. ...</div><div class='long'><p>Listen to click to start and end the tracing.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>event</span> : Event<div class='sub-desc'><p>The OpenLayers click event.</p>\n</div></li></ul></div></div></div><div id='method-onTracingPointerMove' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.TracingMixin'>CpsiMapview.controller.button.TracingMixin</span><br/><a href='source/TracingMixin.html#CpsiMapview-controller-button-TracingMixin-method-onTracingPointerMove' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.TracingMixin-method-onTracingPointerMove' class='name expandable'>onTracingPointerMove</a>( <span class='pre'>event</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Create the tracing geometry when pointer is moved. ...</div><div class='long'><p>Create the tracing geometry when pointer is moved.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>event</span> : Event<div class='sub-desc'><p>The OpenLayers move event</p>\n</div></li></ul></div></div></div><div id='method-setNewTracingOnInteriorStartEndTouch' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.TracingMixin'>CpsiMapview.controller.button.TracingMixin</span><br/><a href='source/TracingMixin.html#CpsiMapview-controller-button-TracingMixin-method-setNewTracingOnInteriorStartEndTouch' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.TracingMixin-method-setNewTracingOnInteriorStartEndTouch' class='name expandable'>setNewTracingOnInteriorStartEndTouch</a>( <span class='pre'>foundFeature, touchCoordinate</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the new tracing feature if interior of line touches the startpoint or the endpoint of another line. ...</div><div class='long'><p>Sets the new tracing feature if interior of line touches the startpoint or the endpoint of another line.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>foundFeature</span> : ol.Feature<div class='sub-desc'><p>The hovered feature to set as new tracing feature</p>\n</div></li><li><span class='pre'>touchCoordinate</span> : ol.coordinate.Coordinate<div class='sub-desc'><p>The coordinate of the touching point</p>\n</div></li></ul></div></div></div><div id='method-setNewTracingOnStartEndInteriorTouch' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.TracingMixin'>CpsiMapview.controller.button.TracingMixin</span><br/><a href='source/TracingMixin.html#CpsiMapview-controller-button-TracingMixin-method-setNewTracingOnStartEndInteriorTouch' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.TracingMixin-method-setNewTracingOnStartEndInteriorTouch' class='name expandable'>setNewTracingOnStartEndInteriorTouch</a>( <span class='pre'>foundFeature, touchCoordinate, pixel</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the new tracing feature if startpoint or endpoint touches the interior of another line. ...</div><div class='long'><p>Sets the new tracing feature if startpoint or endpoint touches the interior of another line.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>foundFeature</span> : ol.Feature<div class='sub-desc'><p>The hovered feature to set as new tracing feature</p>\n</div></li><li><span class='pre'>touchCoordinate</span> : ol.coordinate.Coordinate<div class='sub-desc'><p>The coordinate of the touching point</p>\n</div></li><li><span class='pre'>pixel</span> : ol.pixel<div class='sub-desc'><p>The pixel the user hovered on</p>\n</div></li></ul></div></div></div><div id='method-setNewTracingOnStartEndTouch' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.TracingMixin'>CpsiMapview.controller.button.TracingMixin</span><br/><a href='source/TracingMixin.html#CpsiMapview-controller-button-TracingMixin-method-setNewTracingOnStartEndTouch' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.TracingMixin-method-setNewTracingOnStartEndTouch' class='name expandable'>setNewTracingOnStartEndTouch</a>( <span class='pre'>foundFeature</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the new tracing feature if it is touching via startpoint or endpoint. ...</div><div class='long'><p>Sets the new tracing feature if it is touching via startpoint or endpoint.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>foundFeature</span> : ol.Feature<div class='sub-desc'><p>The hovered feature to set as new tracing feature</p>\n</div></li></ul></div></div></div><div id='method-trackSnappedCoords' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.TracingMixin'>CpsiMapview.controller.button.TracingMixin</span><br/><a href='source/TracingMixin.html#CpsiMapview-controller-button-TracingMixin-method-trackSnappedCoords' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.TracingMixin-method-trackSnappedCoords' class='name expandable'>trackSnappedCoords</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Add a generic Interaction to the map before the last Snap interaction\nSo that we can collected the coordinates of the...</div><div class='long'><p>Add a generic Interaction to the map before the last Snap interaction\nSo that we can collected the coordinates of the latest snapped edge/vertex/node\nThe new Interaction needs to be before the last Snap interaction so that the\nSnap interaction modifies the coordinates to the snapped edge/vertex/node\nAnd passes them down to the next interaction</p>\n</div></div></div><div id='method-updateTraceableFeature' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.TracingMixin'>CpsiMapview.controller.button.TracingMixin</span><br/><a href='source/TracingMixin.html#CpsiMapview-controller-button-TracingMixin-method-updateTraceableFeature' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.TracingMixin-method-updateTraceableFeature' class='name expandable'>updateTraceableFeature</a>( <span class='pre'>foundFeature</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Updates the currently active traceable feature. ...</div><div class='long'><p>Updates the currently active traceable feature.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>foundFeature</span> : ol.Feature<div class='sub-desc'><p>The hovered feature found in the tracing feature array</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});