Ext.data.JsonP.CpsiMapview_view_main_Map({"tagname":"class","name":"CpsiMapview.view.main.Map","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"Map.js","href":"Map.html#CpsiMapview-view-main-Map"}],"aliases":{"widget":["cmv_map"]},"alternateClassNames":[],"extends":"Ext.panel.Panel","mixins":[],"requires":["BasiGX.util.Projection","CpsiMapview.controller.MapController","CpsiMapview.controller.panel.TimeSlider","CpsiMapview.plugin.FeatureAttributeGrouping","CpsiMapview.plugin.FeatureInfoWindow","CpsiMapview.util.SwitchLayer","CpsiMapview.view.toolbar.MapFooter","CpsiMapview.view.toolbar.MapTools","CpsiMapview.view.toolbar.MinimizedWindows","GeoExt.component.Map","GeoExt.state.PermalinkProvider"],"uses":[],"members":[{"name":"addScaleBarToMap","tagname":"property","owner":"CpsiMapview.view.main.Map","id":"property-addScaleBarToMap","meta":{"private":true}},{"name":"controller","tagname":"property","owner":"CpsiMapview.view.main.Map","id":"property-controller","meta":{"private":true}},{"name":"dockedItems","tagname":"property","owner":"CpsiMapview.view.main.Map","id":"property-dockedItems","meta":{"private":true}},{"name":"enableMapClick","tagname":"property","owner":"CpsiMapview.view.main.Map","id":"property-enableMapClick","meta":{}},{"name":"enableMapHover","tagname":"property","owner":"CpsiMapview.view.main.Map","id":"property-enableMapHover","meta":{}},{"name":"enablePermalink","tagname":"property","owner":"CpsiMapview.view.main.Map","id":"property-enablePermalink","meta":{"private":true}},{"name":"lastResolution","tagname":"property","owner":"CpsiMapview.view.main.Map","id":"property-lastResolution","meta":{"private":true}},{"name":"layout","tagname":"property","owner":"CpsiMapview.view.main.Map","id":"property-layout","meta":{"private":true}},{"name":"listeners","tagname":"property","owner":"CpsiMapview.view.main.Map","id":"property-listeners","meta":{}},{"name":"plugins","tagname":"property","owner":"CpsiMapview.view.main.Map","id":"property-plugins","meta":{"private":true}},{"name":"roundPermalinkCoords","tagname":"property","owner":"CpsiMapview.view.main.Map","id":"property-roundPermalinkCoords","meta":{}},{"name":"shouldUpdatePermalink","tagname":"property","owner":"CpsiMapview.view.main.Map","id":"property-shouldUpdatePermalink","meta":{"private":true}},{"name":"applyDefaultsToApplicationConf","tagname":"method","owner":"CpsiMapview.view.main.Map","id":"method-applyDefaultsToApplicationConf","meta":{}},{"name":"applyDefaultsToLayerConf","tagname":"method","owner":"CpsiMapview.view.main.Map","id":"method-applyDefaultsToLayerConf","meta":{}},{"name":"initComponent","tagname":"method","owner":"CpsiMapview.view.main.Map","id":"method-initComponent","meta":{"private":true}},{"name":"registerPermalinkEvents","tagname":"method","owner":"CpsiMapview.view.main.Map","id":"method-registerPermalinkEvents","meta":{"private":true}},{"name":"updatePermalink","tagname":"method","owner":"CpsiMapview.view.main.Map","id":"method-updatePermalink","meta":{"private":true}},{"name":"guess","tagname":"method","owner":"CpsiMapview.view.main.Map","id":"static-method-guess","meta":{"static":true}},{"name":"cmv-init-layersadded","tagname":"event","owner":"CpsiMapview.view.main.Map","id":"event-cmv-init-layersadded","meta":{}},{"name":"cmv-mapclick","tagname":"event","owner":"CpsiMapview.view.main.Map","id":"event-cmv-mapclick","meta":{}}],"code_type":"ext_define","id":"class-CpsiMapview.view.main.Map","component":false,"superclasses":["Ext.panel.Panel"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.panel.Panel<div class='subclass '><strong>CpsiMapview.view.main.Map</strong></div></div><h4>Requires</h4><div class='dependency'>BasiGX.util.Projection</div><div class='dependency'><a href='#!/api/CpsiMapview.controller.MapController' rel='CpsiMapview.controller.MapController' class='docClass'>CpsiMapview.controller.MapController</a></div><div class='dependency'><a href='#!/api/CpsiMapview.controller.panel.TimeSlider' rel='CpsiMapview.controller.panel.TimeSlider' class='docClass'>CpsiMapview.controller.panel.TimeSlider</a></div><div class='dependency'><a href='#!/api/CpsiMapview.plugin.FeatureAttributeGrouping' rel='CpsiMapview.plugin.FeatureAttributeGrouping' class='docClass'>CpsiMapview.plugin.FeatureAttributeGrouping</a></div><div class='dependency'><a href='#!/api/CpsiMapview.plugin.FeatureInfoWindow' rel='CpsiMapview.plugin.FeatureInfoWindow' class='docClass'>CpsiMapview.plugin.FeatureInfoWindow</a></div><div class='dependency'><a href='#!/api/CpsiMapview.util.SwitchLayer' rel='CpsiMapview.util.SwitchLayer' class='docClass'>CpsiMapview.util.SwitchLayer</a></div><div class='dependency'><a href='#!/api/CpsiMapview.view.toolbar.MapFooter' rel='CpsiMapview.view.toolbar.MapFooter' class='docClass'>CpsiMapview.view.toolbar.MapFooter</a></div><div class='dependency'><a href='#!/api/CpsiMapview.view.toolbar.MapTools' rel='CpsiMapview.view.toolbar.MapTools' class='docClass'>CpsiMapview.view.toolbar.MapTools</a></div><div class='dependency'><a href='#!/api/CpsiMapview.view.toolbar.MinimizedWindows' rel='CpsiMapview.view.toolbar.MinimizedWindows' class='docClass'>CpsiMapview.view.toolbar.MinimizedWindows</a></div><div class='dependency'>GeoExt.component.Map</div><div class='dependency'>GeoExt.state.PermalinkProvider</div><h4>Files</h4><div class='dependency'><a href='source/Map.html#CpsiMapview-view-main-Map' target='_blank'>Map.js</a></div></pre><div class='doc-contents'><p>Main map view.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-addScaleBarToMap' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.main.Map'>CpsiMapview.view.main.Map</span><br/><a href='source/Map.html#CpsiMapview-view-main-Map-property-addScaleBarToMap' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.main.Map-property-addScaleBarToMap' class='name expandable'>addScaleBarToMap</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Flag that to add a scale bar to the map or not\n@config {Boolean} ...</div><div class='long'><p>Flag that to add a scale bar to the map or not\n@config {Boolean}</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='property-controller' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.main.Map'>CpsiMapview.view.main.Map</span><br/><a href='source/Map.html#CpsiMapview-view-main-Map-property-controller' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.main.Map-property-controller' class='name expandable'>controller</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&#39;cmv_map&#39;</code></p></div></div></div><div id='property-dockedItems' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.main.Map'>CpsiMapview.view.main.Map</span><br/><a href='source/Map.html#CpsiMapview-view-main-Map-property-dockedItems' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.main.Map-property-dockedItems' class='name expandable'>dockedItems</a> : Array<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>[{xtype: &#39;cmv_maptools&#39;, dock: &#39;top&#39;}, {xtype: &#39;cmv_mapfooter&#39;, dock: &#39;bottom&#39;}]</code></p></div></div></div><div id='property-enableMapClick' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.main.Map'>CpsiMapview.view.main.Map</span><br/><a href='source/Map.html#CpsiMapview-view-main-Map-property-enableMapClick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.main.Map-property-enableMapClick' class='name expandable'>enableMapClick</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Enables a click handler on the map which fires an event\n'cmv-mapclick' with all clicked vector features and their cor...</div><div class='long'><p>Enables a click handler on the map which fires an event\n'cmv-mapclick' with all clicked vector features and their corresponding\nlayers.\n@config {Boolean}</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='property-enableMapHover' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.main.Map'>CpsiMapview.view.main.Map</span><br/><a href='source/Map.html#CpsiMapview-view-main-Map-property-enableMapHover' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.main.Map-property-enableMapHover' class='name expandable'>enableMapHover</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Enables a 'pointerrest' handler on the map which fires an event\n'cmv-map-pointerrest' with all hovered vector feature...</div><div class='long'><p>Enables a 'pointerrest' handler on the map which fires an event\n'cmv-map-pointerrest' with all hovered vector features and their\ncorresponding layers.\n@config {Boolean}</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='property-enablePermalink' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.main.Map'>CpsiMapview.view.main.Map</span><br/><a href='source/Map.html#CpsiMapview-view-main-Map-property-enablePermalink' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.main.Map-property-enablePermalink' class='name expandable'>enablePermalink</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Flag that enables/disables permalink functionality\n@config {Boolean} ...</div><div class='long'><p>Flag that enables/disables permalink functionality\n@config {Boolean}</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='property-lastResolution' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.main.Map'>CpsiMapview.view.main.Map</span><br/><a href='source/Map.html#CpsiMapview-view-main-Map-property-lastResolution' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.main.Map-property-lastResolution' class='name expandable'>lastResolution</a> : Number<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Remembers the last resolution before change. ...</div><div class='long'><p>Remembers the last resolution before change.\nNecessary for detecting resolution change events.</p>\n</div></div></div><div id='property-layout' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.main.Map'>CpsiMapview.view.main.Map</span><br/><a href='source/Map.html#CpsiMapview-view-main-Map-property-layout' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.main.Map-property-layout' class='name expandable'>layout</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&#39;fit&#39;</code></p></div></div></div><div id='property-listeners' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.main.Map'>CpsiMapview.view.main.Map</span><br/><a href='source/Map.html#CpsiMapview-view-main-Map-property-listeners' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.main.Map-property-listeners' class='name expandable'>listeners</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>See blog post https://www.sencha.com/blog/declarative-listeners-in-ext-js-5/\nSetting in initComponent sets scope to t...</div><div class='long'><p>See blog post https://www.sencha.com/blog/declarative-listeners-in-ext-js-5/\nSetting in initComponent sets scope to the parent (wrong) controller</p>\n<p>Defaults to: <code>{&#39;cmv-mapclick&#39;: {fn: &#39;onMapClick&#39;, options: {priority: 500}}}</code></p></div></div></div><div id='property-plugins' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.main.Map'>CpsiMapview.view.main.Map</span><br/><a href='source/Map.html#CpsiMapview-view-main-Map-property-plugins' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.main.Map-property-plugins' class='name expandable'>plugins</a> : Array<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>[{ptype: &#39;cmv_feature_attribute_grouping&#39;, startGroupingEvent: &#39;click&#39;, endGroupingEvent: &#39;context&#39;}]</code></p></div></div></div><div id='property-roundPermalinkCoords' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.main.Map'>CpsiMapview.view.main.Map</span><br/><a href='source/Map.html#CpsiMapview-view-main-Map-property-roundPermalinkCoords' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.main.Map-property-roundPermalinkCoords' class='name expandable'>roundPermalinkCoords</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Flag to steer if center coordinates in the permalink should be rounded or\nnot\n@config {Boolean} ...</div><div class='long'><p>Flag to steer if center coordinates in the permalink should be rounded or\nnot\n@config {Boolean}</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='property-shouldUpdatePermalink' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.main.Map'>CpsiMapview.view.main.Map</span><br/><a href='source/Map.html#CpsiMapview-view-main-Map-property-shouldUpdatePermalink' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.main.Map-property-shouldUpdatePermalink' class='name expandable'>shouldUpdatePermalink</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Flag to show if permalink should be updated or not. ...</div><div class='long'><p>Flag to show if permalink should be updated or not.\nWe do not update the URL when the view was changed in the 'popstate'\nhandler.</p>\n<p>Defaults to: <code>true</code></p></div></div></div></div></div><div class='members-section'><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Instance methods</h3><div id='method-applyDefaultsToApplicationConf' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.main.Map'>CpsiMapview.view.main.Map</span><br/><a href='source/Map.html#CpsiMapview-view-main-Map-method-applyDefaultsToApplicationConf' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.main.Map-method-applyDefaultsToApplicationConf' class='name expandable'>applyDefaultsToApplicationConf</a>( <span class='pre'>layerJson</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Takes the configuration file of the application\nand applies the default values to each layer definition. ...</div><div class='long'><p>Takes the configuration file of the application\nand applies the default values to each layer definition.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>layerJson</span> : *<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-applyDefaultsToLayerConf' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.main.Map'>CpsiMapview.view.main.Map</span><br/><a href='source/Map.html#CpsiMapview-view-main-Map-method-applyDefaultsToLayerConf' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.main.Map-method-applyDefaultsToLayerConf' class='name expandable'>applyDefaultsToLayerConf</a>( <span class='pre'>layerConf, defaults</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Applies the default values to each layer ...</div><div class='long'><p>Applies the default values to each layer</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>layerConf</span> : *<div class='sub-desc'>\n</div></li><li><span class='pre'>defaults</span> : *<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-initComponent' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.main.Map'>CpsiMapview.view.main.Map</span><br/><a href='source/Map.html#CpsiMapview-view-main-Map-method-initComponent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.main.Map-method-initComponent' class='name expandable'>initComponent</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class='pa'>Fires</h3><ul><li><a href=\"#!/api/CpsiMapview.view.main.Map-event-cmv-init-layersadded\" rel=\"CpsiMapview.view.main.Map-event-cmv-init-layersadded\" class=\"docClass\">cmv-init-layersadded</a></li><li>cmv-map-pointermove</li><li>cmv-map-pointerrest</li><li>cmv-map-pointerrestout</li><li><a href=\"#!/api/CpsiMapview.view.main.Map-event-cmv-mapclick\" rel=\"CpsiMapview.view.main.Map-event-cmv-mapclick\" class=\"docClass\">cmv-mapclick</a></li></ul></div></div></div><div id='method-registerPermalinkEvents' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.main.Map'>CpsiMapview.view.main.Map</span><br/><a href='source/Map.html#CpsiMapview-view-main-Map-method-registerPermalinkEvents' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.main.Map-method-registerPermalinkEvents' class='name expandable'>registerPermalinkEvents</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Registers the events to have a permalink synchronization. ...</div><div class='long'><p>Registers the events to have a permalink synchronization.</p>\n</div></div></div><div id='method-updatePermalink' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.main.Map'>CpsiMapview.view.main.Map</span><br/><a href='source/Map.html#CpsiMapview-view-main-Map-method-updatePermalink' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.main.Map-method-updatePermalink' class='name expandable'>updatePermalink</a>( <span class='pre'>mapState</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Updates the permalink as URL hash and pushes the state into the window\nhistory. ...</div><div class='long'><p>Updates the permalink as URL hash and pushes the state into the window\nhistory.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>mapState</span> : Object<div class='sub-desc'></div></li></ul></div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Static methods</h3><div id='static-method-guess' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.main.Map'>CpsiMapview.view.main.Map</span><br/><a href='source/Map.html#CpsiMapview-view-main-Map-static-method-guess' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.main.Map-static-method-guess' class='name expandable'>guess</a>( <span class='pre'></span> ) : <a href=\"#!/api/CpsiMapview.view.main.Map\" rel=\"CpsiMapview.view.main.Map\" class=\"docClass\">CpsiMapview.view.main.Map</a><span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Tries to detect the first occurrence of this map panel. ...</div><div class='long'><p>Tries to detect the first occurrence of this map panel.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/CpsiMapview.view.main.Map\" rel=\"CpsiMapview.view.main.Map\" class=\"docClass\">CpsiMapview.view.main.Map</a></span><div class='sub-desc'><p>The map panel, which is at least\n    a GeoExt.component.Map and possibly an instance of this class.</p>\n</div></li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-event'>Events</h3><div class='subsection'><div id='event-cmv-init-layersadded' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.main.Map'>CpsiMapview.view.main.Map</span><br/><a href='source/Map.html#CpsiMapview-view-main-Map-event-cmv-init-layersadded' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.main.Map-event-cmv-init-layersadded' class='name expandable'>cmv-init-layersadded</a>( <span class='pre'>this, eOpts</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fires when all initial layers from the config have been created and added to the OL map. ...</div><div class='long'><p>Fires when all initial layers from the config have been created and added to the OL map.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>this</span> : <a href=\"#!/api/CpsiMapview.view.main.Map\" rel=\"CpsiMapview.view.main.Map\" class=\"docClass\">CpsiMapview.view.main.Map</a><div class='sub-desc'>\n</div></li><li><span class='pre'>eOpts</span> : Object<div class='sub-desc'><p>The options object passed to Ext.util.Observable.addListener.</p>\n\n</div></li></ul></div></div></div><div id='event-cmv-mapclick' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.main.Map'>CpsiMapview.view.main.Map</span><br/><a href='source/Map.html#CpsiMapview-view-main-Map-event-cmv-mapclick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.main.Map-event-cmv-mapclick' class='name expandable'>cmv-mapclick</a>( <span class='pre'>this, clickInfo, evt, eOpts</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fires when the OL map is clicked. ...</div><div class='long'><p>Fires when the OL map is clicked.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>this</span> : <a href=\"#!/api/CpsiMapview.view.main.Map\" rel=\"CpsiMapview.view.main.Map\" class=\"docClass\">CpsiMapview.view.main.Map</a><div class='sub-desc'>\n</div></li><li><span class='pre'>clickInfo</span> : Object[]<div class='sub-desc'><p>The clicked features and the corresponding layers, like <code>[{feature: aFeat, layer: aLayer}, ...]</code></p>\n</div></li><li><span class='pre'>evt</span> : ol.MapBrowserEvent)<div class='sub-desc'><p>The original 'singleclick' event of OpenLayers</p>\n</div></li><li><span class='pre'>eOpts</span> : Object<div class='sub-desc'><p>The options object passed to Ext.util.Observable.addListener.</p>\n\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});