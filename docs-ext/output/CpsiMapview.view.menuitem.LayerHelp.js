Ext.data.JsonP.CpsiMapview_view_menuitem_LayerHelp({"tagname":"class","name":"CpsiMapview.view.menuitem.LayerHelp","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"LayerHelp.js","href":"LayerHelp.html#CpsiMapview-view-menuitem-LayerHelp"}],"aliases":{"widget":["cmv_menuitem_layerhelp"]},"alternateClassNames":[],"extends":"Ext.menu.Item","mixins":["CpsiMapview.form.HelpMixin"],"requires":["CpsiMapview.util.Grid"],"uses":[],"members":[{"name":"layer","tagname":"cfg","owner":"CpsiMapview.view.menuitem.LayerHelp","id":"cfg-layer","meta":{}},{"name":"text","tagname":"cfg","owner":"CpsiMapview.view.menuitem.LayerHelp","id":"cfg-text","meta":{}},{"name":"viewModel","tagname":"property","owner":"CpsiMapview.view.menuitem.LayerHelp","id":"property-viewModel","meta":{}},{"name":"buildHelpUrl","tagname":"method","owner":"CpsiMapview.form.HelpMixin","id":"method-buildHelpUrl","meta":{"private":true}},{"name":"handlerFunc","tagname":"method","owner":"CpsiMapview.view.menuitem.LayerHelp","id":"method-handlerFunc","meta":{}},{"name":"initComponent","tagname":"method","owner":"CpsiMapview.view.menuitem.LayerHelp","id":"method-initComponent","meta":{"private":true}},{"name":"onHelp","tagname":"method","owner":"CpsiMapview.form.HelpMixin","id":"method-onHelp","meta":{}}],"code_type":"ext_define","id":"class-CpsiMapview.view.menuitem.LayerHelp","component":false,"superclasses":["Ext.menu.Item"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.menu.Item<div class='subclass '><strong>CpsiMapview.view.menuitem.LayerHelp</strong></div></div><h4>Mixins</h4><div class='dependency'><a href='#!/api/CpsiMapview.form.HelpMixin' rel='CpsiMapview.form.HelpMixin' class='docClass'>CpsiMapview.form.HelpMixin</a></div><h4>Requires</h4><div class='dependency'><a href='#!/api/CpsiMapview.util.Grid' rel='CpsiMapview.util.Grid' class='docClass'>CpsiMapview.util.Grid</a></div><h4>Files</h4><div class='dependency'><a href='source/LayerHelp.html#CpsiMapview-view-menuitem-LayerHelp' target='_blank'>LayerHelp.js</a></div></pre><div class='doc-contents'><p>MenuItem to open a help page associated with a layer</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-layer' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.menuitem.LayerHelp'>CpsiMapview.view.menuitem.LayerHelp</span><br/><a href='source/LayerHelp.html#CpsiMapview-view-menuitem-LayerHelp-cfg-layer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.menuitem.LayerHelp-cfg-layer' class='name expandable'>layer</a> : ol.layer.Base<span class=\"signature\"></span></div><div class='description'><div class='short'><p>The connected layer for this item.</p>\n</div><div class='long'><p>The connected layer for this item.</p>\n</div></div></div><div id='cfg-text' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.menuitem.LayerHelp'>CpsiMapview.view.menuitem.LayerHelp</span><br/><a href='source/LayerHelp.html#CpsiMapview-view-menuitem-LayerHelp-cfg-text' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.menuitem.LayerHelp-cfg-text' class='name expandable'>text</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Text shown in this MenuItem ...</div><div class='long'><p>Text shown in this MenuItem</p>\n<p>Defaults to: <code>&#39;Help&#39;</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-viewModel' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.menuitem.LayerHelp'>CpsiMapview.view.menuitem.LayerHelp</span><br/><a href='source/LayerHelp.html#CpsiMapview-view-menuitem-LayerHelp-property-viewModel' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.menuitem.LayerHelp-property-viewModel' class='name expandable'>viewModel</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>An empty view model to store a helpUrl ...</div><div class='long'><p>An empty view model to store a helpUrl</p>\n<p>Defaults to: <code>{}</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-buildHelpUrl' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CpsiMapview.form.HelpMixin' rel='CpsiMapview.form.HelpMixin' class='defined-in docClass'>CpsiMapview.form.HelpMixin</a><br/><a href='source/HelpMixin.html#CpsiMapview-form-HelpMixin-method-buildHelpUrl' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.HelpMixin-method-buildHelpUrl' class='name expandable'>buildHelpUrl</a>( <span class='pre'>helpUrl, rootUrl</span> ) : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Build a URL based on root and page fragments ...</div><div class='long'><p>Build a URL based on root and page fragments</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>helpUrl</span> : String<div class='sub-desc'><p>A full URL or a relative link within the documentation</p>\n</div></li><li><span class='pre'>rootUrl</span> : String<div class='sub-desc'><p>A root/base URL for the documentation</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Full URL to the help page</p>\n</div></li></ul></div></div></div><div id='method-handlerFunc' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.menuitem.LayerHelp'>CpsiMapview.view.menuitem.LayerHelp</span><br/><a href='source/LayerHelp.html#CpsiMapview-view-menuitem-LayerHelp-method-handlerFunc' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.menuitem.LayerHelp-method-handlerFunc' class='name expandable'>handlerFunc</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Executed when this menu item is clicked. ...</div><div class='long'><p>Executed when this menu item is clicked.\nOpens the help page associated with the layer</p>\n</div></div></div><div id='method-initComponent' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.menuitem.LayerHelp'>CpsiMapview.view.menuitem.LayerHelp</span><br/><a href='source/LayerHelp.html#CpsiMapview-view-menuitem-LayerHelp-method-initComponent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.menuitem.LayerHelp-method-initComponent' class='name expandable'>initComponent</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-onHelp' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CpsiMapview.form.HelpMixin' rel='CpsiMapview.form.HelpMixin' class='defined-in docClass'>CpsiMapview.form.HelpMixin</a><br/><a href='source/HelpMixin.html#CpsiMapview-form-HelpMixin-method-onHelp' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.HelpMixin-method-onHelp' class='name expandable'>onHelp</a>( <span class='pre'></span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Opens any associated helpUrl in a new browser tab\nIf the URL does not start with 'http' then an application\nrootHelpU...</div><div class='long'><p>Opens any associated helpUrl in a new browser tab\nIf the URL does not start with 'http' then an application\nrootHelpUrl is appended to the URL if present</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Full URL to the help page*</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});