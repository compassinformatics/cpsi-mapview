Ext.data.JsonP.CpsiMapview_view_window_MinimizableWindow({"tagname":"class","name":"CpsiMapview.view.window.MinimizableWindow","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"MinimizableWindow.js","href":"MinimizableWindow2.html#CpsiMapview-view-window-MinimizableWindow"}],"aliases":{"widget":["cmv_minimizable_window"]},"alternateClassNames":[],"extends":"Ext.window.Window","mixins":[],"requires":["CpsiMapview.controller.window.MinimizableWindow","CpsiMapview.model.window.MinimizableWindow"],"uses":[],"members":[{"name":"constrainHeader","tagname":"property","owner":"CpsiMapview.view.window.MinimizableWindow","id":"property-constrainHeader","meta":{"private":true}},{"name":"controller","tagname":"property","owner":"CpsiMapview.view.window.MinimizableWindow","id":"property-controller","meta":{"private":true}},{"name":"isMinimized","tagname":"property","owner":"CpsiMapview.view.window.MinimizableWindow","id":"property-isMinimized","meta":{}},{"name":"listeners","tagname":"property","owner":"CpsiMapview.view.window.MinimizableWindow","id":"property-listeners","meta":{"private":true}},{"name":"minimizable","tagname":"property","owner":"CpsiMapview.view.window.MinimizableWindow","id":"property-minimizable","meta":{"private":true}},{"name":"minimizeTo","tagname":"property","owner":"CpsiMapview.view.window.MinimizableWindow","id":"property-minimizeTo","meta":{}},{"name":"tools","tagname":"property","owner":"CpsiMapview.view.window.MinimizableWindow","id":"property-tools","meta":{"private":true}},{"name":"viewModel","tagname":"property","owner":"CpsiMapview.view.window.MinimizableWindow","id":"property-viewModel","meta":{"private":true}}],"code_type":"ext_define","id":"class-CpsiMapview.view.window.MinimizableWindow","short_doc":"This class is the minimizable window of cpsi mapview application. ...","component":false,"superclasses":["Ext.window.Window"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.window.Window<div class='subclass '><strong>CpsiMapview.view.window.MinimizableWindow</strong></div></div><h4>Requires</h4><div class='dependency'><a href='#!/api/CpsiMapview.controller.window.MinimizableWindow' rel='CpsiMapview.controller.window.MinimizableWindow' class='docClass'>CpsiMapview.controller.window.MinimizableWindow</a></div><div class='dependency'>CpsiMapview.model.window.MinimizableWindow</div><h4>Files</h4><div class='dependency'><a href='source/MinimizableWindow2.html#CpsiMapview-view-window-MinimizableWindow' target='_blank'>MinimizableWindow.js</a></div></pre><div class='doc-contents'><p>This class is the minimizable window of cpsi mapview application.\nAll instances of this class contain the minimize button in the header\nand already implement the minimization logic. If a\n<a href=\"#!/api/CpsiMapview.view.toolbar.MinimizedWindows\" rel=\"CpsiMapview.view.toolbar.MinimizedWindows\" class=\"docClass\">CpsiMapview.view.toolbar.MinimizedWindows</a> toolbar is given, minimized\nwindows will be added to that toolbar and can be restored afterwards.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-constrainHeader' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.window.MinimizableWindow'>CpsiMapview.view.window.MinimizableWindow</span><br/><a href='source/MinimizableWindow2.html#CpsiMapview-view-window-MinimizableWindow-property-constrainHeader' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.window.MinimizableWindow-property-constrainHeader' class='name expandable'>constrainHeader</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='property-controller' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.window.MinimizableWindow'>CpsiMapview.view.window.MinimizableWindow</span><br/><a href='source/MinimizableWindow2.html#CpsiMapview-view-window-MinimizableWindow-property-controller' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.window.MinimizableWindow-property-controller' class='name expandable'>controller</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&#39;cmv_minimizable_window&#39;</code></p></div></div></div><div id='property-isMinimized' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.window.MinimizableWindow'>CpsiMapview.view.window.MinimizableWindow</span><br/><a href='source/MinimizableWindow2.html#CpsiMapview-view-window-MinimizableWindow-property-isMinimized' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.window.MinimizableWindow-property-isMinimized' class='name expandable'>isMinimized</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>True, if the window is currently minimized,\nfalse otherwise. ...</div><div class='long'><p>True, if the window is currently minimized,\nfalse otherwise.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='property-listeners' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.window.MinimizableWindow'>CpsiMapview.view.window.MinimizableWindow</span><br/><a href='source/MinimizableWindow2.html#CpsiMapview-view-window-MinimizableWindow-property-listeners' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.window.MinimizableWindow-property-listeners' class='name expandable'>listeners</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>{minimize: &#39;onMinimize&#39;, show: &#39;onShow&#39;, close: &#39;onClose&#39;, hide: &#39;onHide&#39;}</code></p></div></div></div><div id='property-minimizable' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.window.MinimizableWindow'>CpsiMapview.view.window.MinimizableWindow</span><br/><a href='source/MinimizableWindow2.html#CpsiMapview-view-window-MinimizableWindow-property-minimizable' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.window.MinimizableWindow-property-minimizable' class='name expandable'>minimizable</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>constrain header within the viewport ...</div><div class='long'><p>constrain header within the viewport</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='property-minimizeTo' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.window.MinimizableWindow'>CpsiMapview.view.window.MinimizableWindow</span><br/><a href='source/MinimizableWindow2.html#CpsiMapview-view-window-MinimizableWindow-property-minimizeTo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.window.MinimizableWindow-property-minimizeTo' class='name expandable'>minimizeTo</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Component to where the window should be added\nwhen minimized. ...</div><div class='long'><p>Component to where the window should be added\nwhen minimized. If null, it will be added to\nthe first MinimizedWindows toolbar found. If\nno toolbar was found, it will minimize into nowhere.</p>\n</div></div></div><div id='property-tools' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.window.MinimizableWindow'>CpsiMapview.view.window.MinimizableWindow</span><br/><a href='source/MinimizableWindow2.html#CpsiMapview-view-window-MinimizableWindow-property-tools' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.window.MinimizableWindow-property-tools' class='name expandable'>tools</a> : Array<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>[{type: &#39;help&#39;, tooltip: &#39;Get Help&#39;, callback: &#39;onHelp&#39;, bind: {hidden: &#39;{!helpUrl}&#39;}}]</code></p></div></div></div><div id='property-viewModel' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.window.MinimizableWindow'>CpsiMapview.view.window.MinimizableWindow</span><br/><a href='source/MinimizableWindow2.html#CpsiMapview-view-window-MinimizableWindow-property-viewModel' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.window.MinimizableWindow-property-viewModel' class='name expandable'>viewModel</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&#39;cmv_minimizable_window&#39;</code></p></div></div></div></div></div></div></div>","meta":{}});