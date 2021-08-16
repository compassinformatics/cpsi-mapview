Ext.data.JsonP.CpsiMapview_plugin_BasicTreeColumnLegends({"tagname":"class","name":"CpsiMapview.plugin.BasicTreeColumnLegends","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"BasicTreeColumnLegends.js","href":"BasicTreeColumnLegends.html#CpsiMapview-plugin-BasicTreeColumnLegends"}],"aliases":{"plugin":["cmv_basic_tree_column_legend"]},"alternateClassNames":[],"extends":"Ext.plugin.Abstract","mixins":[],"requires":["CpsiMapview.util.Legend"],"uses":[],"members":[{"name":"originalCellTpl","tagname":"property","owner":"CpsiMapview.plugin.BasicTreeColumnLegends","id":"property-originalCellTpl","meta":{"private":true}},{"name":"pluginId","tagname":"property","owner":"CpsiMapview.plugin.BasicTreeColumnLegends","id":"property-pluginId","meta":{"private":true}},{"name":"valueReplacementContext","tagname":"property","owner":"CpsiMapview.plugin.BasicTreeColumnLegends","id":"property-valueReplacementContext","meta":{}},{"name":"valueReplacementTpl","tagname":"property","owner":"CpsiMapview.plugin.BasicTreeColumnLegends","id":"property-valueReplacementTpl","meta":{}},{"name":"transparentGif","tagname":"property","owner":"CpsiMapview.plugin.BasicTreeColumnLegends","id":"static-property-transparentGif","meta":{"private":true,"static":true}},{"name":"init","tagname":"method","owner":"CpsiMapview.plugin.BasicTreeColumnLegends","id":"method-init","meta":{"private":true}},{"name":"checkCleanup","tagname":"method","owner":"CpsiMapview.plugin.BasicTreeColumnLegends","id":"static-method-checkCleanup","meta":{"private":true,"static":true}}],"code_type":"ext_define","id":"class-CpsiMapview.plugin.BasicTreeColumnLegends","component":false,"superclasses":["Ext.plugin.Abstract"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.plugin.Abstract<div class='subclass '><strong>CpsiMapview.plugin.BasicTreeColumnLegends</strong></div></div><h4>Requires</h4><div class='dependency'><a href='#!/api/CpsiMapview.util.Legend' rel='CpsiMapview.util.Legend' class='docClass'>CpsiMapview.util.Legend</a></div><h4>Files</h4><div class='dependency'><a href='source/BasicTreeColumnLegends.html#CpsiMapview-plugin-BasicTreeColumnLegends' target='_blank'>BasicTreeColumnLegends.js</a></div></pre><div class='doc-contents'><p>A plugin for Ext.grid.column.Column that overwrites the internal cellTpl to\nsupport legends.</p>\n</div><div class='members'><div class='members-section'><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Instance properties</h3><div id='property-originalCellTpl' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.plugin.BasicTreeColumnLegends'>CpsiMapview.plugin.BasicTreeColumnLegends</span><br/><a href='source/BasicTreeColumnLegends.html#CpsiMapview-plugin-BasicTreeColumnLegends-property-originalCellTpl' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.plugin.BasicTreeColumnLegends-property-originalCellTpl' class='name expandable'>originalCellTpl</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='property-pluginId' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.plugin.BasicTreeColumnLegends'>CpsiMapview.plugin.BasicTreeColumnLegends</span><br/><a href='source/BasicTreeColumnLegends.html#CpsiMapview-plugin-BasicTreeColumnLegends-property-pluginId' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.plugin.BasicTreeColumnLegends-property-pluginId' class='name expandable'>pluginId</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&#39;cmv_basic_tree_column_legend&#39;</code></p></div></div></div><div id='property-valueReplacementContext' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.plugin.BasicTreeColumnLegends'>CpsiMapview.plugin.BasicTreeColumnLegends</span><br/><a href='source/BasicTreeColumnLegends.html#CpsiMapview-plugin-BasicTreeColumnLegends-property-valueReplacementContext' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.plugin.BasicTreeColumnLegends-property-valueReplacementContext' class='name expandable'>valueReplacementContext</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>The context for methods available in the template</p>\n</div><div class='long'><p>The context for methods available in the template</p>\n</div></div></div><div id='property-valueReplacementTpl' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.plugin.BasicTreeColumnLegends'>CpsiMapview.plugin.BasicTreeColumnLegends</span><br/><a href='source/BasicTreeColumnLegends.html#CpsiMapview-plugin-BasicTreeColumnLegends-property-valueReplacementTpl' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.plugin.BasicTreeColumnLegends-property-valueReplacementTpl' class='name expandable'>valueReplacementTpl</a> : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>The Xtemplate strings that will be used instead of the plain {value}\nwhen rendering\nWe add a additional div in order ...</div><div class='long'><p>The Xtemplate strings that will be used instead of the plain {value}\nwhen rendering\nWe add a additional div in order to expand and collapse the legends. The syntax in templates is picky here...</p>\n<p>Defaults to: <code>[&#39;{value}&#39;, &#39;&lt;tpl if=&quot;this.hasLegend(values.record)&quot;&gt;&lt;br /&gt;&#39;, &#39;&lt;tpl for=&quot;lines&quot;&gt;&#39;, &#39;&lt;img src=&quot;{parent.blankUrl}&quot;&#39;, &#39; class=&quot;{parent.childCls} {parent.elbowCls}-img &#39;, &#39;{parent.elbowCls}-&lt;tpl if=&quot;.&quot;&gt;line&lt;tpl else&gt;empty&lt;/tpl&gt;&quot;&#39;, &#39; role=&quot;presentation&quot;/&gt;&#39;, &#39;&lt;/tpl&gt;&#39;, &#39;&lt;img src=&quot;{blankUrl}&quot; class=&quot;{childCls} x-tree-elbow-img&quot;&gt;&#39;, &#39;&lt;img src=&quot;{blankUrl}&quot; class=&quot;{childCls} x-tree-elbow-img&quot;&gt;&#39;, &#39;&lt;img src=&quot;{blankUrl}&quot; class=&quot;{childCls} x-tree-elbow-img&quot;&gt;&#39;, &#39;{[this.getLegendHtml(values.record)]}&#39;, &#39;&lt;/tpl&gt;&#39;]</code></p></div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Static properties</h3><div id='static-property-transparentGif' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.plugin.BasicTreeColumnLegends'>CpsiMapview.plugin.BasicTreeColumnLegends</span><br/><a href='source/BasicTreeColumnLegends.html#CpsiMapview-plugin-BasicTreeColumnLegends-static-property-transparentGif' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.plugin.BasicTreeColumnLegends-static-property-transparentGif' class='name expandable'>transparentGif</a> : String<span class=\"signature\"><span class='private' >private</span><span class='static' >static</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&#39;data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP&#39; + &#39;///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7&#39;</code></p></div></div></div></div></div><div class='members-section'><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Instance methods</h3><div id='method-init' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.plugin.BasicTreeColumnLegends'>CpsiMapview.plugin.BasicTreeColumnLegends</span><br/><a href='source/BasicTreeColumnLegends.html#CpsiMapview-plugin-BasicTreeColumnLegends-method-init' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.plugin.BasicTreeColumnLegends-method-init' class='name expandable'>init</a>( <span class='pre'>column</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>column</span> : Object<div class='sub-desc'></div></li></ul></div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Static methods</h3><div id='static-method-checkCleanup' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.plugin.BasicTreeColumnLegends'>CpsiMapview.plugin.BasicTreeColumnLegends</span><br/><a href='source/BasicTreeColumnLegends.html#CpsiMapview-plugin-BasicTreeColumnLegends-static-method-checkCleanup' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.plugin.BasicTreeColumnLegends-static-method-checkCleanup' class='name expandable'>checkCleanup</a>( <span class='pre'>img</span> )<span class=\"signature\"><span class='private' >private</span><span class='static' >static</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>img</span> : Object<div class='sub-desc'></div></li></ul></div></div></div></div></div></div></div>","meta":{}});