Ext.data.JsonP.CpsiMapview_view_toolbar_ParallelLine({"tagname":"class","name":"CpsiMapview.view.toolbar.ParallelLine","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"ParallelLineToolbar.js","href":"ParallelLineToolbar.html#CpsiMapview-view-toolbar-ParallelLine"}],"aliases":{"widget":["cmv_parallel_line_toolbar"]},"alternateClassNames":[],"extends":"Ext.toolbar.Toolbar","mixins":[],"requires":["BasiGX.view.component.Map","CpsiMapview.util.Turf","Ext.form.field.Number"],"uses":[],"members":[{"name":"feature","tagname":"cfg","owner":"CpsiMapview.view.toolbar.ParallelLine","id":"cfg-feature","meta":{}},{"name":"offsetUnit","tagname":"cfg","owner":"CpsiMapview.view.toolbar.ParallelLine","id":"cfg-offsetUnit","meta":{}},{"name":"cls","tagname":"property","owner":"CpsiMapview.view.toolbar.ParallelLine","id":"property-cls","meta":{"private":true}},{"name":"items","tagname":"property","owner":"CpsiMapview.view.toolbar.ParallelLine","id":"property-items","meta":{"private":true}},{"name":"name","tagname":"property","owner":"CpsiMapview.view.toolbar.ParallelLine","id":"property-name","meta":{"private":true}},{"name":"viewModel","tagname":"property","owner":"CpsiMapview.view.toolbar.ParallelLine","id":"property-viewModel","meta":{"private":true}},{"name":"applyFeature","tagname":"method","owner":"CpsiMapview.view.toolbar.ParallelLine","id":"method-applyFeature","meta":{"private":true}},{"name":"applyOffsetUnit","tagname":"method","owner":"CpsiMapview.view.toolbar.ParallelLine","id":"method-applyOffsetUnit","meta":{"private":true}},{"name":"createParallelFeature","tagname":"method","owner":"CpsiMapview.view.toolbar.ParallelLine","id":"method-createParallelFeature","meta":{}},{"name":"getFeature","tagname":"method","owner":"CpsiMapview.view.toolbar.ParallelLine","id":"method-getFeature","meta":{}},{"name":"getOffsetUnit","tagname":"method","owner":"CpsiMapview.view.toolbar.ParallelLine","id":"method-getOffsetUnit","meta":{}},{"name":"setFeature","tagname":"method","owner":"CpsiMapview.view.toolbar.ParallelLine","id":"method-setFeature","meta":{}},{"name":"setOffsetUnit","tagname":"method","owner":"CpsiMapview.view.toolbar.ParallelLine","id":"method-setOffsetUnit","meta":{}},{"name":"updateFeature","tagname":"method","owner":"CpsiMapview.view.toolbar.ParallelLine","id":"method-updateFeature","meta":{"private":true}},{"name":"parallelLineCreated","tagname":"event","owner":"CpsiMapview.view.toolbar.ParallelLine","id":"event-parallelLineCreated","meta":{}}],"code_type":"ext_define","id":"class-CpsiMapview.view.toolbar.ParallelLine","component":false,"superclasses":["Ext.toolbar.Toolbar"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.toolbar.Toolbar<div class='subclass '><strong>CpsiMapview.view.toolbar.ParallelLine</strong></div></div><h4>Requires</h4><div class='dependency'>BasiGX.view.component.Map</div><div class='dependency'><a href='#!/api/CpsiMapview.util.Turf' rel='CpsiMapview.util.Turf' class='docClass'>CpsiMapview.util.Turf</a></div><div class='dependency'>Ext.form.field.Number</div><h4>Files</h4><div class='dependency'><a href='source/ParallelLineToolbar.html#CpsiMapview-view-toolbar-ParallelLine' target='_blank'>ParallelLineToolbar.js</a></div></pre><div class='doc-contents'><p>This class is the toolbar for creating parallel lines.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-feature' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.toolbar.ParallelLine'>CpsiMapview.view.toolbar.ParallelLine</span><br/><a href='source/ParallelLineToolbar.html#CpsiMapview-view-toolbar-ParallelLine-cfg-feature' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.toolbar.ParallelLine-cfg-feature' class='name expandable'>feature</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>The feature to create the parallel line for.</p>\n</div><div class='long'><p>The feature to create the parallel line for.</p>\n</div></div></div><div id='cfg-offsetUnit' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.toolbar.ParallelLine'>CpsiMapview.view.toolbar.ParallelLine</span><br/><a href='source/ParallelLineToolbar.html#CpsiMapview-view-toolbar-ParallelLine-cfg-offsetUnit' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.toolbar.ParallelLine-cfg-offsetUnit' class='name expandable'>offsetUnit</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The unit to use for calculating the offset. ...</div><div class='long'><p>The unit to use for calculating the offset. Can be one of\n'degrees', 'radians', 'miles', 'kilometers', 'inches',\n'yards', 'meters'.</p>\n\n<p>Defaults to 'meters'.</p>\n<p>Defaults to: <code>&#39;meters&#39;</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-cls' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.toolbar.ParallelLine'>CpsiMapview.view.toolbar.ParallelLine</span><br/><a href='source/ParallelLineToolbar.html#CpsiMapview-view-toolbar-ParallelLine-property-cls' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.toolbar.ParallelLine-property-cls' class='name expandable'>cls</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&#39;cmv_parallel_line_toolbar&#39;</code></p></div></div></div><div id='property-items' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.toolbar.ParallelLine'>CpsiMapview.view.toolbar.ParallelLine</span><br/><a href='source/ParallelLineToolbar.html#CpsiMapview-view-toolbar-ParallelLine-property-items' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.toolbar.ParallelLine-property-items' class='name expandable'>items</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='property-name' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.toolbar.ParallelLine'>CpsiMapview.view.toolbar.ParallelLine</span><br/><a href='source/ParallelLineToolbar.html#CpsiMapview-view-toolbar-ParallelLine-property-name' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.toolbar.ParallelLine-property-name' class='name expandable'>name</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='property-viewModel' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.toolbar.ParallelLine'>CpsiMapview.view.toolbar.ParallelLine</span><br/><a href='source/ParallelLineToolbar.html#CpsiMapview-view-toolbar-ParallelLine-property-viewModel' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.toolbar.ParallelLine-property-viewModel' class='name expandable'>viewModel</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>{data: {offsetLabel: &#39;Offset&#39;, parallelTooltip: &#39;Create parallel line&#39;, offset: 0, feature: null, parallelFeature: null}}</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-applyFeature' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.toolbar.ParallelLine'>CpsiMapview.view.toolbar.ParallelLine</span><br/><a href='source/ParallelLineToolbar.html#CpsiMapview-view-toolbar-ParallelLine-method-applyFeature' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.toolbar.ParallelLine-method-applyFeature' class='name expandable'>applyFeature</a>( <span class='pre'>feature</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>feature</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-applyOffsetUnit' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.toolbar.ParallelLine'>CpsiMapview.view.toolbar.ParallelLine</span><br/><a href='source/ParallelLineToolbar.html#CpsiMapview-view-toolbar-ParallelLine-method-applyOffsetUnit' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.toolbar.ParallelLine-method-applyOffsetUnit' class='name expandable'>applyOffsetUnit</a>( <span class='pre'>offsetUnit</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>offsetUnit</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-createParallelFeature' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.toolbar.ParallelLine'>CpsiMapview.view.toolbar.ParallelLine</span><br/><a href='source/ParallelLineToolbar.html#CpsiMapview-view-toolbar-ParallelLine-method-createParallelFeature' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.toolbar.ParallelLine-method-createParallelFeature' class='name expandable'>createParallelFeature</a>( <span class='pre'></span> ) : void<span class=\"signature\"></span></div><div class='description'><div class='short'>Creates a parallel line for the given feature with given offset. ...</div><div class='long'><p>Creates a parallel line for the given feature with given offset.</p>\n\n<p>Fires the parallelLineCreated event.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>void</span><div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Fires</h3><ul><li><a href=\"#!/api/CpsiMapview.view.toolbar.ParallelLine-event-parallelLineCreated\" rel=\"CpsiMapview.view.toolbar.ParallelLine-event-parallelLineCreated\" class=\"docClass\">parallelLineCreated</a></li></ul></div></div></div><div id='method-getFeature' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.toolbar.ParallelLine'>CpsiMapview.view.toolbar.ParallelLine</span><br/><a href='source/ParallelLineToolbar.html#CpsiMapview-view-toolbar-ParallelLine-cfg-feature' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.toolbar.ParallelLine-method-getFeature' class='name expandable'>getFeature</a>( <span class='pre'></span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns the value of feature. ...</div><div class='long'><p>Returns the value of <a href=\"#!/api/CpsiMapview.view.toolbar.ParallelLine-cfg-feature\" rel=\"CpsiMapview.view.toolbar.ParallelLine-cfg-feature\" class=\"docClass\">feature</a>.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getOffsetUnit' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.toolbar.ParallelLine'>CpsiMapview.view.toolbar.ParallelLine</span><br/><a href='source/ParallelLineToolbar.html#CpsiMapview-view-toolbar-ParallelLine-cfg-offsetUnit' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.toolbar.ParallelLine-method-getOffsetUnit' class='name expandable'>getOffsetUnit</a>( <span class='pre'></span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns the value of offsetUnit. ...</div><div class='long'><p>Returns the value of <a href=\"#!/api/CpsiMapview.view.toolbar.ParallelLine-cfg-offsetUnit\" rel=\"CpsiMapview.view.toolbar.ParallelLine-cfg-offsetUnit\" class=\"docClass\">offsetUnit</a>.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setFeature' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.toolbar.ParallelLine'>CpsiMapview.view.toolbar.ParallelLine</span><br/><a href='source/ParallelLineToolbar.html#CpsiMapview-view-toolbar-ParallelLine-cfg-feature' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.toolbar.ParallelLine-method-setFeature' class='name expandable'>setFeature</a>( <span class='pre'>feature</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the value of feature. ...</div><div class='long'><p>Sets the value of <a href=\"#!/api/CpsiMapview.view.toolbar.ParallelLine-cfg-feature\" rel=\"CpsiMapview.view.toolbar.ParallelLine-cfg-feature\" class=\"docClass\">feature</a>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>feature</span> : Object<div class='sub-desc'><p>The new value.</p>\n</div></li></ul></div></div></div><div id='method-setOffsetUnit' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.toolbar.ParallelLine'>CpsiMapview.view.toolbar.ParallelLine</span><br/><a href='source/ParallelLineToolbar.html#CpsiMapview-view-toolbar-ParallelLine-cfg-offsetUnit' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.toolbar.ParallelLine-method-setOffsetUnit' class='name expandable'>setOffsetUnit</a>( <span class='pre'>offsetUnit</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the value of offsetUnit. ...</div><div class='long'><p>Sets the value of <a href=\"#!/api/CpsiMapview.view.toolbar.ParallelLine-cfg-offsetUnit\" rel=\"CpsiMapview.view.toolbar.ParallelLine-cfg-offsetUnit\" class=\"docClass\">offsetUnit</a>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>offsetUnit</span> : String<div class='sub-desc'><p>The new value.</p>\n</div></li></ul></div></div></div><div id='method-updateFeature' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.toolbar.ParallelLine'>CpsiMapview.view.toolbar.ParallelLine</span><br/><a href='source/ParallelLineToolbar.html#CpsiMapview-view-toolbar-ParallelLine-method-updateFeature' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.toolbar.ParallelLine-method-updateFeature' class='name expandable'>updateFeature</a>( <span class='pre'>newFeature</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>newFeature</span> : Object<div class='sub-desc'></div></li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-event'>Events</h3><div class='subsection'><div id='event-parallelLineCreated' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.toolbar.ParallelLine'>CpsiMapview.view.toolbar.ParallelLine</span><br/><a href='source/ParallelLineToolbar.html#CpsiMapview-view-toolbar-ParallelLine-event-parallelLineCreated' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.toolbar.ParallelLine-event-parallelLineCreated' class='name expandable'>parallelLineCreated</a>( <span class='pre'>parallelFeature, eOpts</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fires, when a new parallel line was created. ...</div><div class='long'><p>Fires, when a new parallel line was created.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>parallelFeature</span> : ol.Feature<div class='sub-desc'><p>The created parallel feature.</p>\n</div></li><li><span class='pre'>eOpts</span> : Object<div class='sub-desc'><p>The options object passed to Ext.util.Observable.addListener.</p>\n\n\n\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});