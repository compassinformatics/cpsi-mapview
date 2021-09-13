Ext.data.JsonP.CpsiMapview_view_button_StreetViewTool({"tagname":"class","name":"CpsiMapview.view.button.StreetViewTool","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"StreetViewTool.js","href":"StreetViewTool.html#CpsiMapview-view-button-StreetViewTool"}],"aliases":{"widget":["cmv_streetview_tool"]},"alternateClassNames":[],"extends":"Ext.button.Button","mixins":[],"requires":["CpsiMapview.controller.button.StreetViewTool"],"uses":[],"members":[{"name":"enableToggle","tagname":"cfg","owner":"CpsiMapview.view.button.StreetViewTool","id":"cfg-enableToggle","meta":{"private":true}},{"name":"glyph","tagname":"cfg","owner":"CpsiMapview.view.button.StreetViewTool","id":"cfg-glyph","meta":{}},{"name":"map","tagname":"cfg","owner":"CpsiMapview.view.button.StreetViewTool","id":"cfg-map","meta":{}},{"name":"noPanoramaWarningText","tagname":"cfg","owner":"CpsiMapview.view.button.StreetViewTool","id":"cfg-noPanoramaWarningText","meta":{}},{"name":"noPanoramaWarningTitle","tagname":"cfg","owner":"CpsiMapview.view.button.StreetViewTool","id":"cfg-noPanoramaWarningTitle","meta":{}},{"name":"showNoPanoramaWarning","tagname":"cfg","owner":"CpsiMapview.view.button.StreetViewTool","id":"cfg-showNoPanoramaWarning","meta":{}},{"name":"svDefaultPov","tagname":"cfg","owner":"CpsiMapview.view.button.StreetViewTool","id":"cfg-svDefaultPov","meta":{}},{"name":"svWinHeight","tagname":"cfg","owner":"CpsiMapview.view.button.StreetViewTool","id":"cfg-svWinHeight","meta":{}},{"name":"svWinTitleDateLabel","tagname":"cfg","owner":"CpsiMapview.view.button.StreetViewTool","id":"cfg-svWinTitleDateLabel","meta":{}},{"name":"svWinTitlePrefix","tagname":"cfg","owner":"CpsiMapview.view.button.StreetViewTool","id":"cfg-svWinTitlePrefix","meta":{}},{"name":"svWinWidth","tagname":"cfg","owner":"CpsiMapview.view.button.StreetViewTool","id":"cfg-svWinWidth","meta":{}},{"name":"vectorIcon","tagname":"cfg","owner":"CpsiMapview.view.button.StreetViewTool","id":"cfg-vectorIcon","meta":{}},{"name":"vectorLayerStyle","tagname":"cfg","owner":"CpsiMapview.view.button.StreetViewTool","id":"cfg-vectorLayerStyle","meta":{}},{"name":"controller","tagname":"property","owner":"CpsiMapview.view.button.StreetViewTool","id":"property-controller","meta":{"private":true}},{"name":"listeners","tagname":"property","owner":"CpsiMapview.view.button.StreetViewTool","id":"property-listeners","meta":{}},{"name":"name","tagname":"property","owner":"CpsiMapview.view.button.StreetViewTool","id":"property-name","meta":{"private":true}},{"name":"tooltip","tagname":"property","owner":"CpsiMapview.view.button.StreetViewTool","id":"property-tooltip","meta":{"private":true}}],"code_type":"ext_define","id":"class-CpsiMapview.view.button.StreetViewTool","component":false,"superclasses":["Ext.button.Button"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.button.Button<div class='subclass '><strong>CpsiMapview.view.button.StreetViewTool</strong></div></div><h4>Requires</h4><div class='dependency'><a href='#!/api/CpsiMapview.controller.button.StreetViewTool' rel='CpsiMapview.controller.button.StreetViewTool' class='docClass'>CpsiMapview.controller.button.StreetViewTool</a></div><h4>Files</h4><div class='dependency'><a href='source/StreetViewTool.html#CpsiMapview-view-button-StreetViewTool' target='_blank'>StreetViewTool.js</a></div></pre><div class='doc-contents'><p>Button to open the Street View tool.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-enableToggle' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.button.StreetViewTool'>CpsiMapview.view.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-view-button-StreetViewTool-cfg-enableToggle' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.button.StreetViewTool-cfg-enableToggle' class='name expandable'>enableToggle</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Enable toggle mode for the button. ...</div><div class='long'><p>Enable toggle mode for the button.</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='cfg-glyph' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.button.StreetViewTool'>CpsiMapview.view.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-view-button-StreetViewTool-cfg-glyph' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.button.StreetViewTool-cfg-glyph' class='name expandable'>glyph</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The icon used for the button. ...</div><div class='long'><p>The icon used for the button.</p>\n<p>Defaults to: <code>&#39;xf21d@FontAwesome&#39;</code></p></div></div></div><div id='cfg-map' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.button.StreetViewTool'>CpsiMapview.view.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-view-button-StreetViewTool-cfg-map' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.button.StreetViewTool-cfg-map' class='name expandable'>map</a> : ol.Map<span class=\"signature\"></span></div><div class='description'><div class='short'><p>The OL map work / sync with this tool.</p>\n</div><div class='long'><p>The OL map work / sync with this tool.</p>\n</div></div></div><div id='cfg-noPanoramaWarningText' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.button.StreetViewTool'>CpsiMapview.view.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-view-button-StreetViewTool-cfg-noPanoramaWarningText' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.button.StreetViewTool-cfg-noPanoramaWarningText' class='name expandable'>noPanoramaWarningText</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Text of the alert UI shown in case no panorama is available. ...</div><div class='long'><p>Text of the alert UI shown in case no panorama is available.</p>\n<p>Defaults to: <code>&#39;No panorama available for the clicked position.&#39;</code></p></div></div></div><div id='cfg-noPanoramaWarningTitle' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.button.StreetViewTool'>CpsiMapview.view.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-view-button-StreetViewTool-cfg-noPanoramaWarningTitle' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.button.StreetViewTool-cfg-noPanoramaWarningTitle' class='name expandable'>noPanoramaWarningTitle</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Title of the alert UI shown in case no panorama is available. ...</div><div class='long'><p>Title of the alert UI shown in case no panorama is available.</p>\n<p>Defaults to: <code>&#39;INFO&#39;</code></p></div></div></div><div id='cfg-showNoPanoramaWarning' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.button.StreetViewTool'>CpsiMapview.view.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-view-button-StreetViewTool-cfg-showNoPanoramaWarning' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.button.StreetViewTool-cfg-showNoPanoramaWarning' class='name expandable'>showNoPanoramaWarning</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Flag to steer if a warning UI is shown in case no panorama is available\nfor the clicked position. ...</div><div class='long'><p>Flag to steer if a warning UI is shown in case no panorama is available\nfor the clicked position.</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='cfg-svDefaultPov' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.button.StreetViewTool'>CpsiMapview.view.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-view-button-StreetViewTool-cfg-svDefaultPov' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.button.StreetViewTool-cfg-svDefaultPov' class='name expandable'>svDefaultPov</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>The default / initial POV settings for the Street View panorama. ...</div><div class='long'><p>The default / initial POV settings for the Street View panorama.</p>\n<p>Defaults to: <code>{heading: 34, pitch: 10, zoom: 1}</code></p></div></div></div><div id='cfg-svWinHeight' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.button.StreetViewTool'>CpsiMapview.view.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-view-button-StreetViewTool-cfg-svWinHeight' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.button.StreetViewTool-cfg-svWinHeight' class='name expandable'>svWinHeight</a> : Number<span class=\"signature\"></span></div><div class='description'><div class='short'>Initial height of the Street View window. ...</div><div class='long'><p>Initial height of the Street View window.</p>\n<p>Defaults to: <code>600</code></p></div></div></div><div id='cfg-svWinTitleDateLabel' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.button.StreetViewTool'>CpsiMapview.view.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-view-button-StreetViewTool-cfg-svWinTitleDateLabel' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.button.StreetViewTool-cfg-svWinTitleDateLabel' class='name expandable'>svWinTitleDateLabel</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The label to be set in front of the image date of the SV panorama. ...</div><div class='long'><p>The label to be set in front of the image date of the SV panorama.</p>\n<p>Defaults to: <code>&#39; Image Date: &#39;</code></p></div></div></div><div id='cfg-svWinTitlePrefix' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.button.StreetViewTool'>CpsiMapview.view.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-view-button-StreetViewTool-cfg-svWinTitlePrefix' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.button.StreetViewTool-cfg-svWinTitlePrefix' class='name expandable'>svWinTitlePrefix</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The prefix for the title of the Street View window. ...</div><div class='long'><p>The prefix for the title of the Street View window.</p>\n<p>Defaults to: <code>&#39;Google Street View&#39;</code></p></div></div></div><div id='cfg-svWinWidth' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.button.StreetViewTool'>CpsiMapview.view.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-view-button-StreetViewTool-cfg-svWinWidth' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.button.StreetViewTool-cfg-svWinWidth' class='name expandable'>svWinWidth</a> : Number<span class=\"signature\"></span></div><div class='description'><div class='short'>Initial width of the Street View window. ...</div><div class='long'><p>Initial width of the Street View window.</p>\n<p>Defaults to: <code>800</code></p></div></div></div><div id='cfg-vectorIcon' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.button.StreetViewTool'>CpsiMapview.view.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-view-button-StreetViewTool-cfg-vectorIcon' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.button.StreetViewTool-cfg-vectorIcon' class='name expandable'>vectorIcon</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The position icon image to be shown on the map. ...</div><div class='long'><p>The position icon image to be shown on the map.</p>\n<p>Defaults to: <code>&#39;resources/img/streetViewFOV.png&#39;</code></p></div></div></div><div id='cfg-vectorLayerStyle' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.button.StreetViewTool'>CpsiMapview.view.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-view-button-StreetViewTool-cfg-vectorLayerStyle' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.button.StreetViewTool-cfg-vectorLayerStyle' class='name expandable'>vectorLayerStyle</a> : ol.style.Style<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Optional style for the position layer.</p>\n</div><div class='long'><p>Optional style for the position layer.</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-controller' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.button.StreetViewTool'>CpsiMapview.view.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-view-button-StreetViewTool-property-controller' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.button.StreetViewTool-property-controller' class='name expandable'>controller</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>The controller for this class. ...</div><div class='long'><p>The controller for this class.</p>\n<p>Defaults to: <code>&#39;cmv_streetview_tool&#39;</code></p></div></div></div><div id='property-listeners' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.button.StreetViewTool'>CpsiMapview.view.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-view-button-StreetViewTool-property-listeners' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.button.StreetViewTool-property-listeners' class='name expandable'>listeners</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Register the listeners and redirect them\nto their corresponding controller methods ...</div><div class='long'><p>Register the listeners and redirect them\nto their corresponding controller methods</p>\n<p>Defaults to: <code>{toggle: &#39;onToggle&#39;, beforedestroy: &#39;onBeforeDestroy&#39;}</code></p></div></div></div><div id='property-name' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.button.StreetViewTool'>CpsiMapview.view.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-view-button-StreetViewTool-property-name' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.button.StreetViewTool-property-name' class='name expandable'>name</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>The name to be used e.g. ...</div><div class='long'><p>The name to be used e.g. in ComponentQueries.</p>\n<p>Defaults to: <code>&#39;streetViewToolButton&#39;</code></p></div></div></div><div id='property-tooltip' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.button.StreetViewTool'>CpsiMapview.view.button.StreetViewTool</span><br/><a href='source/StreetViewTool.html#CpsiMapview-view-button-StreetViewTool-property-tooltip' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.button.StreetViewTool-property-tooltip' class='name expandable'>tooltip</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>The tooltip to display when hovering over the button ...</div><div class='long'><p>The tooltip to display when hovering over the button</p>\n<p>Defaults to: <code>&#39;Activate the StreetView tool&#39;</code></p></div></div></div></div></div></div></div>","meta":{}});