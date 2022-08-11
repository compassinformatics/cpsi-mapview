Ext.data.JsonP.CpsiMapview_view_panel_TimeSlider({"tagname":"class","name":"CpsiMapview.view.panel.TimeSlider","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"TimeSlider.js","href":"TimeSlider2.html#CpsiMapview-view-panel-TimeSlider"}],"aliases":{"widget":["cmv_timeslider"]},"alternateClassNames":[],"extends":"Ext.panel.Panel","mixins":[],"requires":["CpsiMapview.controller.panel.TimeSlider","Ext.slider.Multi"],"uses":[],"members":[{"name":"cls","tagname":"property","owner":"CpsiMapview.view.panel.TimeSlider","id":"property-cls","meta":{}},{"name":"controller","tagname":"property","owner":"CpsiMapview.view.panel.TimeSlider","id":"property-controller","meta":{"private":true}},{"name":"endDate","tagname":"property","owner":"CpsiMapview.view.panel.TimeSlider","id":"property-endDate","meta":{}},{"name":"layout","tagname":"property","owner":"CpsiMapview.view.panel.TimeSlider","id":"property-layout","meta":{"private":true}},{"name":"listeners","tagname":"property","owner":"CpsiMapview.view.panel.TimeSlider","id":"property-listeners","meta":{}},{"name":"selectedDate","tagname":"property","owner":"CpsiMapview.view.panel.TimeSlider","id":"property-selectedDate","meta":{}},{"name":"startDate","tagname":"property","owner":"CpsiMapview.view.panel.TimeSlider","id":"property-startDate","meta":{}},{"name":"timeIncrementUnit","tagname":"property","owner":"CpsiMapview.view.panel.TimeSlider","id":"property-timeIncrementUnit","meta":{}},{"name":"viewModel","tagname":"property","owner":"CpsiMapview.view.panel.TimeSlider","id":"property-viewModel","meta":{}},{"name":"initComponent","tagname":"method","owner":"CpsiMapview.view.panel.TimeSlider","id":"method-initComponent","meta":{}}],"code_type":"ext_define","id":"class-CpsiMapview.view.panel.TimeSlider","component":false,"superclasses":["Ext.panel.Panel"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.panel.Panel<div class='subclass '><strong>CpsiMapview.view.panel.TimeSlider</strong></div></div><h4>Requires</h4><div class='dependency'><a href='#!/api/CpsiMapview.controller.panel.TimeSlider' rel='CpsiMapview.controller.panel.TimeSlider' class='docClass'>CpsiMapview.controller.panel.TimeSlider</a></div><div class='dependency'>Ext.slider.Multi</div><h4>Files</h4><div class='dependency'><a href='source/TimeSlider2.html#CpsiMapview-view-panel-TimeSlider' target='_blank'>TimeSlider.js</a></div></pre><div class='doc-contents'><p>This class is the time slider component of cpsi mapview application</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-cls' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.panel.TimeSlider'>CpsiMapview.view.panel.TimeSlider</span><br/><a href='source/TimeSlider2.html#CpsiMapview-view-panel-TimeSlider-property-cls' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.panel.TimeSlider-property-cls' class='name expandable'>cls</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The CSS class of the slider ...</div><div class='long'><p>The CSS class of the slider</p>\n<p>Defaults to: <code>&#39;cpsi-time-slider&#39;</code></p></div></div></div><div id='property-controller' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.panel.TimeSlider'>CpsiMapview.view.panel.TimeSlider</span><br/><a href='source/TimeSlider2.html#CpsiMapview-view-panel-TimeSlider-property-controller' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.panel.TimeSlider-property-controller' class='name expandable'>controller</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&#39;cmv_timeslider&#39;</code></p></div></div></div><div id='property-endDate' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.panel.TimeSlider'>CpsiMapview.view.panel.TimeSlider</span><br/><a href='source/TimeSlider2.html#CpsiMapview-view-panel-TimeSlider-property-endDate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.panel.TimeSlider-property-endDate' class='name expandable'>endDate</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>The end date of slider</p>\n</div><div class='long'><p>The end date of slider</p>\n</div></div></div><div id='property-layout' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.panel.TimeSlider'>CpsiMapview.view.panel.TimeSlider</span><br/><a href='source/TimeSlider2.html#CpsiMapview-view-panel-TimeSlider-property-layout' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.panel.TimeSlider-property-layout' class='name expandable'>layout</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&#39;hbox&#39;</code></p></div></div></div><div id='property-listeners' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.panel.TimeSlider'>CpsiMapview.view.panel.TimeSlider</span><br/><a href='source/TimeSlider2.html#CpsiMapview-view-panel-TimeSlider-property-listeners' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.panel.TimeSlider-property-listeners' class='name expandable'>listeners</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Listener to be called when all layers are added to set configured time\nto time dependent layers ...</div><div class='long'><p>Listener to be called when all layers are added to set configured time\nto time dependent layers</p>\n<p>Defaults to: <code>{allLayersAdded: &#39;setTimeOnLayers&#39;}</code></p></div></div></div><div id='property-selectedDate' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.panel.TimeSlider'>CpsiMapview.view.panel.TimeSlider</span><br/><a href='source/TimeSlider2.html#CpsiMapview-view-panel-TimeSlider-property-selectedDate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.panel.TimeSlider-property-selectedDate' class='name expandable'>selectedDate</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>The selected date (after initialization) as Date object</p>\n</div><div class='long'><p>The selected date (after initialization) as Date object</p>\n</div></div></div><div id='property-startDate' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.panel.TimeSlider'>CpsiMapview.view.panel.TimeSlider</span><br/><a href='source/TimeSlider2.html#CpsiMapview-view-panel-TimeSlider-property-startDate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.panel.TimeSlider-property-startDate' class='name expandable'>startDate</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>The start date of slider</p>\n</div><div class='long'><p>The start date of slider</p>\n</div></div></div><div id='property-timeIncrementUnit' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.panel.TimeSlider'>CpsiMapview.view.panel.TimeSlider</span><br/><a href='source/TimeSlider2.html#CpsiMapview-view-panel-TimeSlider-property-timeIncrementUnit' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.panel.TimeSlider-property-timeIncrementUnit' class='name expandable'>timeIncrementUnit</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The unit of time increment (currently only year and month supported) ...</div><div class='long'><p>The unit of time increment (currently only year and month supported)</p>\n<p>Defaults to: <code>&#39;year&#39;</code></p></div></div></div><div id='property-viewModel' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.panel.TimeSlider'>CpsiMapview.view.panel.TimeSlider</span><br/><a href='source/TimeSlider2.html#CpsiMapview-view-panel-TimeSlider-property-viewModel' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.panel.TimeSlider-property-viewModel' class='name expandable'>viewModel</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>{data: {isRange: false}}</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-initComponent' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.panel.TimeSlider'>CpsiMapview.view.panel.TimeSlider</span><br/><a href='source/TimeSlider2.html#CpsiMapview-view-panel-TimeSlider-method-initComponent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.panel.TimeSlider-method-initComponent' class='name expandable'>initComponent</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div></div></div></div></div>","meta":{}});