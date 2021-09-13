Ext.data.JsonP.CpsiMapview_view_menuitem_LayerMetadata({"tagname":"class","name":"CpsiMapview.view.menuitem.LayerMetadata","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"LayerMetadata.js","href":"LayerMetadata.html#CpsiMapview-view-menuitem-LayerMetadata"}],"aliases":{"widget":["cmv_menuitem_layermetadata"]},"alternateClassNames":[],"extends":"Ext.menu.Item","mixins":[],"requires":["CpsiMapview.util.Layer"],"uses":[],"members":[{"name":"layer","tagname":"cfg","owner":"CpsiMapview.view.menuitem.LayerMetadata","id":"cfg-layer","meta":{}},{"name":"text","tagname":"cfg","owner":"CpsiMapview.view.menuitem.LayerMetadata","id":"cfg-text","meta":{}},{"name":"alertNoMetadata","tagname":"method","owner":"CpsiMapview.view.menuitem.LayerMetadata","id":"method-alertNoMetadata","meta":{}},{"name":"handlerFunc","tagname":"method","owner":"CpsiMapview.view.menuitem.LayerMetadata","id":"method-handlerFunc","meta":{}},{"name":"initComponent","tagname":"method","owner":"CpsiMapview.view.menuitem.LayerMetadata","id":"method-initComponent","meta":{"private":true}}],"code_type":"ext_define","id":"class-CpsiMapview.view.menuitem.LayerMetadata","component":false,"superclasses":["Ext.menu.Item"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.menu.Item<div class='subclass '><strong>CpsiMapview.view.menuitem.LayerMetadata</strong></div></div><h4>Requires</h4><div class='dependency'><a href='#!/api/CpsiMapview.util.Layer' rel='CpsiMapview.util.Layer' class='docClass'>CpsiMapview.util.Layer</a></div><h4>Files</h4><div class='dependency'><a href='source/LayerMetadata.html#CpsiMapview-view-menuitem-LayerMetadata' target='_blank'>LayerMetadata.js</a></div></pre><div class='doc-contents'><p>MenuItem to show a metadata window for a layer</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-layer' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.menuitem.LayerMetadata'>CpsiMapview.view.menuitem.LayerMetadata</span><br/><a href='source/LayerMetadata.html#CpsiMapview-view-menuitem-LayerMetadata-cfg-layer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.menuitem.LayerMetadata-cfg-layer' class='name expandable'>layer</a> : ol.layer.Base<span class=\"signature\"></span></div><div class='description'><div class='short'><p>The connected layer for this item.</p>\n</div><div class='long'><p>The connected layer for this item.</p>\n</div></div></div><div id='cfg-text' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.menuitem.LayerMetadata'>CpsiMapview.view.menuitem.LayerMetadata</span><br/><a href='source/LayerMetadata.html#CpsiMapview-view-menuitem-LayerMetadata-cfg-text' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.menuitem.LayerMetadata-cfg-text' class='name expandable'>text</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Text shown in this MenuItem ...</div><div class='long'><p>Text shown in this MenuItem</p>\n<p>Defaults to: <code>&#39;Metadata&#39;</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-alertNoMetadata' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.menuitem.LayerMetadata'>CpsiMapview.view.menuitem.LayerMetadata</span><br/><a href='source/LayerMetadata.html#CpsiMapview-view-menuitem-LayerMetadata-method-alertNoMetadata' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.menuitem.LayerMetadata-method-alertNoMetadata' class='name expandable'>alertNoMetadata</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Notifies user that metadata is not availble ...</div><div class='long'><p>Notifies user that metadata is not availble</p>\n</div></div></div><div id='method-handlerFunc' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.menuitem.LayerMetadata'>CpsiMapview.view.menuitem.LayerMetadata</span><br/><a href='source/LayerMetadata.html#CpsiMapview-view-menuitem-LayerMetadata-method-handlerFunc' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.menuitem.LayerMetadata-method-handlerFunc' class='name expandable'>handlerFunc</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Executed when this menu item is clicked. ...</div><div class='long'><p>Executed when this menu item is clicked.\nOpens a window with metadata for the connected layer.</p>\n</div></div></div><div id='method-initComponent' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.menuitem.LayerMetadata'>CpsiMapview.view.menuitem.LayerMetadata</span><br/><a href='source/LayerMetadata.html#CpsiMapview-view-menuitem-LayerMetadata-method-initComponent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.menuitem.LayerMetadata-method-initComponent' class='name expandable'>initComponent</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div></div></div></div></div>","meta":{}});