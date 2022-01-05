Ext.data.JsonP.CpsiMapview_controller_button_StreetViewTool({"tagname":"class","name":"CpsiMapview.controller.button.StreetViewTool","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"StreetViewTool.js","href":"StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool"}],"aliases":{"controller":["cmv_streetview_tool"]},"alternateClassNames":[],"extends":"Ext.app.ViewController","mixins":[],"requires":["BasiGX.util.Layer","BasiGX.util.Map","CpsiMapview.view.window.MinimizableWindow"],"uses":[],"members":[{"name":"vectorLayer","tagname":"cfg","owner":"CpsiMapview.controller.button.StreetViewTool","id":"cfg-vectorLayer","meta":{}},{"name":"map","tagname":"property","owner":"CpsiMapview.controller.button.StreetViewTool","id":"property-map","meta":{"readonly":true}},{"name":"streetViewService","tagname":"property","owner":"CpsiMapview.controller.button.StreetViewTool","id":"property-streetViewService","meta":{"readonly":true}},{"name":"svPositionChangedListener","tagname":"property","owner":"CpsiMapview.controller.button.StreetViewTool","id":"property-svPositionChangedListener","meta":{"private":true}},{"name":"svPovChangedListener","tagname":"property","owner":"CpsiMapview.controller.button.StreetViewTool","id":"property-svPovChangedListener","meta":{"private":true}},{"name":"vectorLayerName","tagname":"property","owner":"CpsiMapview.controller.button.StreetViewTool","id":"property-vectorLayerName","meta":{"private":true}},{"name":"constructor","tagname":"method","owner":"CpsiMapview.controller.button.StreetViewTool","id":"method-constructor","meta":{}},{"name":"drawPositionFeature","tagname":"method","owner":"CpsiMapview.controller.button.StreetViewTool","id":"method-drawPositionFeature","meta":{"private":true}},{"name":"getHeadingRad","tagname":"method","owner":"CpsiMapview.controller.button.StreetViewTool","id":"method-getHeadingRad","meta":{}},{"name":"getPositionCoord","tagname":"method","owner":"CpsiMapview.controller.button.StreetViewTool","id":"method-getPositionCoord","meta":{}},{"name":"gmapsLatLng2olCoord","tagname":"method","owner":"CpsiMapview.controller.button.StreetViewTool","id":"method-gmapsLatLng2olCoord","meta":{}},{"name":"handlePositionChanged","tagname":"method","owner":"CpsiMapview.controller.button.StreetViewTool","id":"method-handlePositionChanged","meta":{"private":true}},{"name":"handlePovChanged","tagname":"method","owner":"CpsiMapview.controller.button.StreetViewTool","id":"method-handlePovChanged","meta":{"private":true}},{"name":"init","tagname":"method","owner":"CpsiMapview.controller.button.StreetViewTool","id":"method-init","meta":{"private":true}},{"name":"normaliseDegrees","tagname":"method","owner":"CpsiMapview.controller.button.StreetViewTool","id":"method-normaliseDegrees","meta":{"private":true}},{"name":"olCoord2GmapsLatLng","tagname":"method","owner":"CpsiMapview.controller.button.StreetViewTool","id":"method-olCoord2GmapsLatLng","meta":{}},{"name":"onBeforeDestroy","tagname":"method","owner":"CpsiMapview.controller.button.StreetViewTool","id":"method-onBeforeDestroy","meta":{}},{"name":"onMapClick","tagname":"method","owner":"CpsiMapview.controller.button.StreetViewTool","id":"method-onMapClick","meta":{"private":true}},{"name":"onToggle","tagname":"method","owner":"CpsiMapview.controller.button.StreetViewTool","id":"method-onToggle","meta":{"private":true}},{"name":"registerGmapsEvents","tagname":"method","owner":"CpsiMapview.controller.button.StreetViewTool","id":"method-registerGmapsEvents","meta":{}},{"name":"registerMapListeners","tagname":"method","owner":"CpsiMapview.controller.button.StreetViewTool","id":"method-registerMapListeners","meta":{}},{"name":"showStreetViewWindow","tagname":"method","owner":"CpsiMapview.controller.button.StreetViewTool","id":"method-showStreetViewWindow","meta":{"private":true}},{"name":"unregisterGmapsEvents","tagname":"method","owner":"CpsiMapview.controller.button.StreetViewTool","id":"method-unregisterGmapsEvents","meta":{}},{"name":"updatePositionFeature","tagname":"method","owner":"CpsiMapview.controller.button.StreetViewTool","id":"method-updatePositionFeature","meta":{}}],"code_type":"ext_define","id":"class-CpsiMapview.controller.button.StreetViewTool","component":false,"superclasses":["Ext.app.ViewController"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.app.ViewController<div class='subclass '><strong>CpsiMapview.controller.button.StreetViewTool</strong></div></div><h4>Requires</h4><div class='dependency'>BasiGX.util.Layer</div><div class='dependency'>BasiGX.util.Map</div><div class='dependency'><a href='#!/api/CpsiMapview.view.window.MinimizableWindow' rel='CpsiMapview.view.window.MinimizableWindow' class='docClass'>CpsiMapview.view.window.MinimizableWindow</a></div><h4>Files</h4><div class='dependency'><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool' target='_blank'>StreetViewTool.js</a></div></pre><div class='doc-contents'><p>This class is the controller of the button to open the Street View tool.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-vectorLayer' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-cfg-vectorLayer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-cfg-vectorLayer' class='name expandable'>vectorLayer</a> : ol.layer.Vector<span class=\"signature\"></span></div><div class='description'><div class='short'><p>The vector layer to draw the Street View position feature.</p>\n</div><div class='long'><p>The vector layer to draw the Street View position feature.</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-map' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-property-map' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-property-map' class='name expandable'>map</a> : ol.Map<span class=\"signature\"><span class='readonly' >readonly</span></span></div><div class='description'><div class='short'><p>The OL map work / sync with this tool.</p>\n</div><div class='long'><p>The OL map work / sync with this tool.</p>\n</div></div></div><div id='property-streetViewService' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-property-streetViewService' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-property-streetViewService' class='name expandable'>streetViewService</a> : google.maps.StreetViewService<span class=\"signature\"><span class='readonly' >readonly</span></span></div><div class='description'><div class='short'><p>The Street View Service instance.</p>\n</div><div class='long'><p>The Street View Service instance.</p>\n</div></div></div><div id='property-svPositionChangedListener' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-property-svPositionChangedListener' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-property-svPositionChangedListener' class='name expandable'>svPositionChangedListener</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Listener object for the 'position_changed' event. ...</div><div class='long'><p>Listener object for the 'position_changed' event.\nUsed to unregister the event.</p>\n</div></div></div><div id='property-svPovChangedListener' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-property-svPovChangedListener' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-property-svPovChangedListener' class='name expandable'>svPovChangedListener</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Listener object for the 'pov_changed' event. ...</div><div class='long'><p>Listener object for the 'pov_changed' event.\nUsed to unregister the event.</p>\n</div></div></div><div id='property-vectorLayerName' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-property-vectorLayerName' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-property-vectorLayerName' class='name expandable'>vectorLayerName</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>The identificator for the layer to draw the Street View position feature. ...</div><div class='long'><p>The identificator for the layer to draw the Street View position feature.</p>\n<p>Defaults to: <code>&#39;StreetViewLayer&#39;</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-method-constructor' class='name expandable'>CpsiMapview.controller.button.StreetViewTool</a>( <span class='pre'></span> ) : <a href=\"#!/api/CpsiMapview.controller.button.StreetViewTool\" rel=\"CpsiMapview.controller.button.StreetViewTool\" class=\"docClass\">CpsiMapview.controller.button.StreetViewTool</a><span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/CpsiMapview.controller.button.StreetViewTool\" rel=\"CpsiMapview.controller.button.StreetViewTool\" class=\"docClass\">CpsiMapview.controller.button.StreetViewTool</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-drawPositionFeature' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-method-drawPositionFeature' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-method-drawPositionFeature' class='name expandable'>drawPositionFeature</a>( <span class='pre'>coord</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Draws the position feature on the map. ...</div><div class='long'><p>Draws the position feature on the map. Clears an eventually existing\nposition feature before adding the new one.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>coord</span> : ol.Coordinate<div class='sub-desc'><p>Position to draw on the map</p>\n</div></li></ul></div></div></div><div id='method-getHeadingRad' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-method-getHeadingRad' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-method-getHeadingRad' class='name expandable'>getHeadingRad</a>( <span class='pre'></span> ) : Number<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns the current heading of the SV panorama as radiant. ...</div><div class='long'><p>Returns the current heading of the SV panorama as radiant.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Number</span><div class='sub-desc'><p>Heading in radiant</p>\n</div></li></ul></div></div></div><div id='method-getPositionCoord' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-method-getPositionCoord' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-method-getPositionCoord' class='name expandable'>getPositionCoord</a>( <span class='pre'></span> ) : ol.Coordinate<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns the current position of the SV panorama as OL coordinate. ...</div><div class='long'><p>Returns the current position of the SV panorama as OL coordinate.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>ol.Coordinate</span><div class='sub-desc'><p>SV panorama position</p>\n</div></li></ul></div></div></div><div id='method-gmapsLatLng2olCoord' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-method-gmapsLatLng2olCoord' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-method-gmapsLatLng2olCoord' class='name expandable'>gmapsLatLng2olCoord</a>( <span class='pre'>latLng</span> ) : ol.Coordinate<span class=\"signature\"></span></div><div class='description'><div class='short'>Converts an Google Maps LatLng object to a OpenLayers coordinate. ...</div><div class='long'><p>Converts an Google Maps LatLng object to a OpenLayers coordinate.\nTransforms the coordinates to the map projection.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>latLng</span> : google.maps.LatLng<div class='sub-desc'><p>Google Maps LatLng object</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>ol.Coordinate</span><div class='sub-desc'><p>OL coordinate in map projection</p>\n</div></li></ul></div></div></div><div id='method-handlePositionChanged' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-method-handlePositionChanged' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-method-handlePositionChanged' class='name expandable'>handlePositionChanged</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Handles 'position_changed' event of the SV panorama. ...</div><div class='long'><p>Handles 'position_changed' event of the SV panorama.\nTriggers <a href=\"#!/api/CpsiMapview.controller.button.StreetViewTool-method-updatePositionFeature\" rel=\"CpsiMapview.controller.button.StreetViewTool-method-updatePositionFeature\" class=\"docClass\">updatePositionFeature</a>.</p>\n</div></div></div><div id='method-handlePovChanged' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-method-handlePovChanged' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-method-handlePovChanged' class='name expandable'>handlePovChanged</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Handles 'pov_changed' event of the SV panorama. ...</div><div class='long'><p>Handles 'pov_changed' event of the SV panorama.\nTriggers <a href=\"#!/api/CpsiMapview.controller.button.StreetViewTool-method-updatePositionFeature\" rel=\"CpsiMapview.controller.button.StreetViewTool-method-updatePositionFeature\" class=\"docClass\">updatePositionFeature</a>.</p>\n</div></div></div><div id='method-init' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-method-init' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-method-init' class='name expandable'>init</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-normaliseDegrees' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-method-normaliseDegrees' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-method-normaliseDegrees' class='name expandable'>normaliseDegrees</a>( <span class='pre'>value</span> ) : Number<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Normalizes the given degree value. ...</div><div class='long'><p>Normalizes the given degree value.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : Number<div class='sub-desc'><p>Degree value to normalize</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Number</span><div class='sub-desc'><p>Normalized degree value</p>\n</div></li></ul></div></div></div><div id='method-olCoord2GmapsLatLng' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-method-olCoord2GmapsLatLng' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-method-olCoord2GmapsLatLng' class='name expandable'>olCoord2GmapsLatLng</a>( <span class='pre'>coords</span> ) : google.maps.LatLng<span class=\"signature\"></span></div><div class='description'><div class='short'>Converts an OpenLayers coordinate to a Google Maps LatLng object. ...</div><div class='long'><p>Converts an OpenLayers coordinate to a Google Maps LatLng object.\nTransforms the coordinates to EPSG:4326.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>coords</span> : ol.Coordinate<div class='sub-desc'><p>OL coordinate to transform</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>google.maps.LatLng</span><div class='sub-desc'><p>Google Maps LatLng object</p>\n</div></li></ul></div></div></div><div id='method-onBeforeDestroy' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-method-onBeforeDestroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-method-onBeforeDestroy' class='name expandable'>onBeforeDestroy</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Handles the 'beforedestroy' event of the view. ...</div><div class='long'><p>Handles the 'beforedestroy' event of the view.\nPerforms several cleanup steps.</p>\n</div></div></div><div id='method-onMapClick' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-method-onMapClick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-method-onMapClick' class='name expandable'>onMapClick</a>( <span class='pre'>evt</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Handles 'singleclick' event on the map. ...</div><div class='long'><p>Handles 'singleclick' event on the map.\nShow window with Street View panorama for clicked position (if existing)</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>evt</span> : ol.MapBrowserEvent<div class='sub-desc'><p>OL event object</p>\n</div></li></ul></div></div></div><div id='method-onToggle' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-method-onToggle' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-method-onToggle' class='name expandable'>onToggle</a>( <span class='pre'>btn, pressed</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Handles the 'toggle' event of the button (view). ...</div><div class='long'><p>Handles the 'toggle' event of the button (view).</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>btn</span> : Ext.button.Button<div class='sub-desc'><p>The toggled button</p>\n</div></li><li><span class='pre'>pressed</span> : Boolean<div class='sub-desc'><p>New pressed state</p>\n</div></li></ul></div></div></div><div id='method-registerGmapsEvents' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-method-registerGmapsEvents' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-method-registerGmapsEvents' class='name expandable'>registerGmapsEvents</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Registers the 'pov_changed' and the 'position_changed' events for the\nSV panorama. ...</div><div class='long'><p>Registers the 'pov_changed' and the 'position_changed' events for the\nSV panorama.</p>\n</div></div></div><div id='method-registerMapListeners' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-method-registerMapListeners' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-method-registerMapListeners' class='name expandable'>registerMapListeners</a>( <span class='pre'>activate</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Registers listeners on the map we need for this tool. ...</div><div class='long'><p>Registers listeners on the map we need for this tool.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>activate</span> : Boolean<div class='sub-desc'><p>Flag to activate / deactivate the listeners</p>\n</div></li></ul></div></div></div><div id='method-showStreetViewWindow' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-method-showStreetViewWindow' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-method-showStreetViewWindow' class='name expandable'>showStreetViewWindow</a>( <span class='pre'>latLng</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Shows the window with the Street View panorama at the given position or\nfires an event 'missingpanorama' on the view ...</div><div class='long'><p>Shows the window with the Street View panorama at the given position or\nfires an event 'missingpanorama' on the view instance of this controller.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>latLng</span> : google.maps.LatLng<div class='sub-desc'><p>Position to show SV panorama at</p>\n</div></li></ul></div></div></div><div id='method-unregisterGmapsEvents' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-method-unregisterGmapsEvents' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-method-unregisterGmapsEvents' class='name expandable'>unregisterGmapsEvents</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Unregisters the 'pov_changed' and the 'position_changed' events for the\nSV panorama. ...</div><div class='long'><p>Unregisters the 'pov_changed' and the 'position_changed' events for the\nSV panorama.</p>\n</div></div></div><div id='method-updatePositionFeature' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.controller.button.StreetViewTool'>CpsiMapview.controller.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-controller-button-StreetViewTool-method-updatePositionFeature' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.button.StreetViewTool-method-updatePositionFeature' class='name expandable'>updatePositionFeature</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Updates an existing position feature by applying the current position and\nheading of the currently opened SV panorama. ...</div><div class='long'><p>Updates an existing position feature by applying the current position and\nheading of the currently opened SV panorama.</p>\n</div></div></div></div></div></div></div>","meta":{}});