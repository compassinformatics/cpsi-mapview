Ext.data.JsonP.CpsiMapview_view_window_ParallelLine({"tagname":"class","name":"CpsiMapview.view.window.ParallelLine","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"ParallelLineWindow.js","href":"ParallelLineWindow3.html#CpsiMapview-view-window-ParallelLine"}],"aliases":{"widget":["cmv_parallel_line_window"]},"alternateClassNames":[],"extends":"Ext.window.Window","mixins":[],"requires":["CpsiMapview.controller.window.ParallelLine","CpsiMapview.model.window.ParallelLine","CpsiMapview.view.toolbar.ParallelLine","Ext.button.Button"],"uses":[],"members":[{"name":"controller","tagname":"property","owner":"CpsiMapview.view.window.ParallelLine","id":"property-controller","meta":{"private":true}},{"name":"items","tagname":"property","owner":"CpsiMapview.view.window.ParallelLine","id":"property-items","meta":{"private":true}},{"name":"layer","tagname":"property","owner":"CpsiMapview.view.window.ParallelLine","id":"property-layer","meta":{"private":true}},{"name":"listeners","tagname":"property","owner":"CpsiMapview.view.window.ParallelLine","id":"property-listeners","meta":{"private":true}},{"name":"title","tagname":"property","owner":"CpsiMapview.view.window.ParallelLine","id":"property-title","meta":{"private":true}},{"name":"viewModel","tagname":"property","owner":"CpsiMapview.view.window.ParallelLine","id":"property-viewModel","meta":{"private":true}}],"code_type":"ext_define","id":"class-CpsiMapview.view.window.ParallelLine","short_doc":"This is an example class for the usage of the ParallelLine toolbar. ...","component":false,"superclasses":["Ext.window.Window"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.window.Window<div class='subclass '><strong>CpsiMapview.view.window.ParallelLine</strong></div></div><h4>Requires</h4><div class='dependency'><a href='#!/api/CpsiMapview.controller.window.ParallelLine' rel='CpsiMapview.controller.window.ParallelLine' class='docClass'>CpsiMapview.controller.window.ParallelLine</a></div><div class='dependency'>CpsiMapview.model.window.ParallelLine</div><div class='dependency'><a href='#!/api/CpsiMapview.view.toolbar.ParallelLine' rel='CpsiMapview.view.toolbar.ParallelLine' class='docClass'>CpsiMapview.view.toolbar.ParallelLine</a></div><div class='dependency'>Ext.button.Button</div><h4>Files</h4><div class='dependency'><a href='source/ParallelLineWindow3.html#CpsiMapview-view-window-ParallelLine' target='_blank'>ParallelLineWindow.js</a></div></pre><div class='doc-contents'><p>This is an example class for the usage of the ParallelLine toolbar.\nA new layer will be added to the map, that contains the latest created\nfeature.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-controller' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.window.ParallelLine'>CpsiMapview.view.window.ParallelLine</span><br/><a href='source/ParallelLineWindow3.html#CpsiMapview-view-window-ParallelLine-property-controller' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.window.ParallelLine-property-controller' class='name expandable'>controller</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&#39;cmv_parallel_line_window&#39;</code></p></div></div></div><div id='property-items' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.window.ParallelLine'>CpsiMapview.view.window.ParallelLine</span><br/><a href='source/ParallelLineWindow3.html#CpsiMapview-view-window-ParallelLine-property-items' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.window.ParallelLine-property-items' class='name expandable'>items</a> : Array<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>[{xtype: &#39;button&#39;, text: &#39;Select Feature (example button)&#39;, enableToggle: true, listeners: {toggle: &#39;onSelectFeatureToggle&#39;}}, {xtype: &#39;cmv_parallel_line_toolbar&#39;, bind: {feature: &#39;{selectedFeature}&#39;}, listeners: {parallelLineCreated: &#39;onParallelLineCreated&#39;}}]</code></p></div></div></div><div id='property-layer' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.window.ParallelLine'>CpsiMapview.view.window.ParallelLine</span><br/><a href='source/ParallelLineWindow3.html#CpsiMapview-view-window-ParallelLine-property-layer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.window.ParallelLine-property-layer' class='name expandable'>layer</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='property-listeners' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.window.ParallelLine'>CpsiMapview.view.window.ParallelLine</span><br/><a href='source/ParallelLineWindow3.html#CpsiMapview-view-window-ParallelLine-property-listeners' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.window.ParallelLine-property-listeners' class='name expandable'>listeners</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>{beforedestroy: &#39;onBeforeDestroy&#39;}</code></p></div></div></div><div id='property-title' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.window.ParallelLine'>CpsiMapview.view.window.ParallelLine</span><br/><a href='source/ParallelLineWindow3.html#CpsiMapview-view-window-ParallelLine-property-title' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.window.ParallelLine-property-title' class='name expandable'>title</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&#39;Parallel Line Example&#39;</code></p></div></div></div><div id='property-viewModel' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.window.ParallelLine'>CpsiMapview.view.window.ParallelLine</span><br/><a href='source/ParallelLineWindow3.html#CpsiMapview-view-window-ParallelLine-property-viewModel' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.window.ParallelLine-property-viewModel' class='name expandable'>viewModel</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&#39;cmv_parallel_line_window&#39;</code></p></div></div></div></div></div></div></div>","meta":{}});