Ext.data.JsonP.CpsiMapview_view_layer_ToolTip({"tagname":"class","name":"CpsiMapview.view.layer.ToolTip","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"ToolTip.js","href":"ToolTip.html#CpsiMapview-view-layer-ToolTip"}],"aliases":{"widget":["cmv_layer_tooltip"]},"alternateClassNames":[],"extends":"Ext.tip.Tip","mixins":[],"requires":[],"uses":[],"members":[{"name":"The","tagname":"cfg","owner":"CpsiMapview.view.layer.ToolTip","id":"cfg-The","meta":{}},{"name":"layer","tagname":"cfg","owner":"CpsiMapview.view.layer.ToolTip","id":"cfg-layer","meta":{}},{"name":"toolTipConfig","tagname":"cfg","owner":"CpsiMapview.view.layer.ToolTip","id":"cfg-toolTipConfig","meta":{}},{"name":"bgColor","tagname":"property","owner":"CpsiMapview.view.layer.ToolTip","id":"property-bgColor","meta":{}},{"name":"bold","tagname":"property","owner":"CpsiMapview.view.layer.ToolTip","id":"property-bold","meta":{}},{"name":"opacity","tagname":"property","owner":"CpsiMapview.view.layer.ToolTip","id":"property-opacity","meta":{}},{"name":"textColor","tagname":"property","owner":"CpsiMapview.view.layer.ToolTip","id":"property-textColor","meta":{}},{"name":"constructor","tagname":"method","owner":"CpsiMapview.view.layer.ToolTip","id":"method-constructor","meta":{}},{"name":"draw","tagname":"method","owner":"CpsiMapview.view.layer.ToolTip","id":"method-draw","meta":{}},{"name":"formatFunction","tagname":"method","owner":"CpsiMapview.view.layer.ToolTip","id":"method-formatFunction","meta":{}},{"name":"clear","tagname":"method","owner":"CpsiMapview.view.layer.ToolTip","id":"static-method-clear","meta":{"static":true}}],"code_type":"ext_define","id":"class-CpsiMapview.view.layer.ToolTip","short_doc":"Mouse tooltip for a vector layer to show layer/feature information on the\nmap. ...","component":false,"superclasses":["Ext.tip.Tip"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.tip.Tip<div class='subclass '><strong>CpsiMapview.view.layer.ToolTip</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/ToolTip.html#CpsiMapview-view-layer-ToolTip' target='_blank'>ToolTip.js</a></div></pre><div class='doc-contents'><p>Mouse tooltip for a vector layer to show layer/feature information on the\nmap. For example show attributes when feature gets hovered with the mouse.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-The' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.layer.ToolTip'>CpsiMapview.view.layer.ToolTip</span><br/><a href='source/ToolTip.html#CpsiMapview-view-layer-ToolTip-cfg-The' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.layer.ToolTip-cfg-The' class='name expandable'>The</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>offset from the event's mouse y-position</p>\n</div><div class='long'><p>offset from the event's mouse y-position</p>\n</div></div></div><div id='cfg-layer' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.layer.ToolTip'>CpsiMapview.view.layer.ToolTip</span><br/><a href='source/ToolTip.html#CpsiMapview-view-layer-ToolTip-cfg-layer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.layer.ToolTip-cfg-layer' class='name expandable'>layer</a> : ol.layer.Base<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Layer refrence for which this tooltip shows the content</p>\n</div><div class='long'><p>Layer refrence for which this tooltip shows the content</p>\n</div></div></div><div id='cfg-toolTipConfig' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.layer.ToolTip'>CpsiMapview.view.layer.ToolTip</span><br/><a href='source/ToolTip.html#CpsiMapview-view-layer-ToolTip-cfg-toolTipConfig' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.layer.ToolTip-cfg-toolTipConfig' class='name expandable'>toolTipConfig</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>The tooltip configuration from the layer JSON-configuration</p>\n</div><div class='long'><p>The tooltip configuration from the layer JSON-configuration</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-bgColor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.layer.ToolTip'>CpsiMapview.view.layer.ToolTip</span><br/><a href='source/ToolTip.html#CpsiMapview-view-layer-ToolTip-property-bgColor' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.layer.ToolTip-property-bgColor' class='name expandable'>bgColor</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Custom background color of this tooltip\nColor</p>\n</div><div class='long'><p>Custom background color of this tooltip\nColor</p>\n</div></div></div><div id='property-bold' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.layer.ToolTip'>CpsiMapview.view.layer.ToolTip</span><br/><a href='source/ToolTip.html#CpsiMapview-view-layer-ToolTip-property-bold' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.layer.ToolTip-property-bold' class='name expandable'>bold</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Custom bold font weight of this tooltip\ntrue=bold ...</div><div class='long'><p>Custom bold font weight of this tooltip\ntrue=bold</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='property-opacity' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.layer.ToolTip'>CpsiMapview.view.layer.ToolTip</span><br/><a href='source/ToolTip.html#CpsiMapview-view-layer-ToolTip-property-opacity' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.layer.ToolTip-property-opacity' class='name expandable'>opacity</a> : Number<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Custom background opacity of this tooltip\nOpacity between 0 and 1</p>\n</div><div class='long'><p>Custom background opacity of this tooltip\nOpacity between 0 and 1</p>\n</div></div></div><div id='property-textColor' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.layer.ToolTip'>CpsiMapview.view.layer.ToolTip</span><br/><a href='source/ToolTip.html#CpsiMapview-view-layer-ToolTip-property-textColor' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.layer.ToolTip-property-textColor' class='name expandable'>textColor</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Custom text color of this tooltip\nColor</p>\n</div><div class='long'><p>Custom text color of this tooltip\nColor</p>\n</div></div></div></div></div><div class='members-section'><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Instance methods</h3><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.layer.ToolTip'>CpsiMapview.view.layer.ToolTip</span><br/><a href='source/ToolTip.html#CpsiMapview-view-layer-ToolTip-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/CpsiMapview.view.layer.ToolTip-method-constructor' class='name expandable'>CpsiMapview.view.layer.ToolTip</a>( <span class='pre'>config</span> ) : <a href=\"#!/api/CpsiMapview.view.layer.ToolTip\" rel=\"CpsiMapview.view.layer.ToolTip\" class=\"docClass\">CpsiMapview.view.layer.ToolTip</a><span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/CpsiMapview.view.layer.ToolTip\" rel=\"CpsiMapview.view.layer.ToolTip\" class=\"docClass\">CpsiMapview.view.layer.ToolTip</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-draw' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.layer.ToolTip'>CpsiMapview.view.layer.ToolTip</span><br/><a href='source/ToolTip.html#CpsiMapview-view-layer-ToolTip-method-draw' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.layer.ToolTip-method-draw' class='name expandable'>draw</a>( <span class='pre'>feature, evt</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Draws a tooltip at the given event position. ...</div><div class='long'><p>Draws a tooltip at the given event position.\nThe content is derived from the <a href=\"#!/api/CpsiMapview.view.layer.ToolTip-method-formatFunction\" rel=\"CpsiMapview.view.layer.ToolTip-method-formatFunction\" class=\"docClass\">formatFunction</a>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>feature</span> : ol.Feature<div class='sub-desc'><p>The feature to draw the tooltip for</p>\n</div></li><li><span class='pre'>evt</span> : ol.MapBrowserEvent<div class='sub-desc'><p>The MapBrowserEvent event of OpenLayers</p>\n</div></li></ul></div></div></div><div id='method-formatFunction' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.layer.ToolTip'>CpsiMapview.view.layer.ToolTip</span><br/><a href='source/ToolTip.html#CpsiMapview-view-layer-ToolTip-method-formatFunction' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.layer.ToolTip-method-formatFunction' class='name expandable'>formatFunction</a>( <span class='pre'>feature</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Tranforms the feature's attributes to the wanted HTML structure shown in\nthis tooltip. ...</div><div class='long'><p>Tranforms the feature's attributes to the wanted HTML structure shown in\nthis tooltip.\nThis function can be overridden if different HTML is needed for a custom\nlayer.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>feature</span> : ol.Feature<div class='sub-desc'><p>The feature to get the HTML for</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>HTML code as text</p>\n</div></li></ul></div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Static methods</h3><div id='static-method-clear' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.layer.ToolTip'>CpsiMapview.view.layer.ToolTip</span><br/><a href='source/ToolTip.html#CpsiMapview-view-layer-ToolTip-static-method-clear' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.layer.ToolTip-static-method-clear' class='name expandable'>clear</a>( <span class='pre'></span> )<span class=\"signature\"><span class='static' >static</span></span></div><div class='description'><div class='short'>Hides all layer tooltips. ...</div><div class='long'><p>Hides all layer tooltips.</p>\n</div></div></div></div></div></div></div>","meta":{}});