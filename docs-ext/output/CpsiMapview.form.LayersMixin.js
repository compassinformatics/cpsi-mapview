Ext.data.JsonP.CpsiMapview_form_LayersMixin({"tagname":"class","name":"CpsiMapview.form.LayersMixin","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"LayersMixin.js","href":"LayersMixin.html#CpsiMapview-form-LayersMixin"}],"aliases":{},"alternateClassNames":[],"extends":"Ext.Mixin","mixins":[],"requires":["BasiGX.util.Map"],"uses":[],"members":[{"name":"hideLayerWhenMinimized","tagname":"property","owner":"CpsiMapview.form.LayersMixin","id":"property-hideLayerWhenMinimized","meta":{"private":true}},{"name":"mixinConfig","tagname":"property","owner":"CpsiMapview.form.LayersMixin","id":"property-mixinConfig","meta":{"private":true}},{"name":"onWindowHide","tagname":"method","owner":"CpsiMapview.form.LayersMixin","id":"method-onWindowHide","meta":{}},{"name":"onWindowMinimize","tagname":"method","owner":"CpsiMapview.form.LayersMixin","id":"method-onWindowMinimize","meta":{}},{"name":"onWindowShow","tagname":"method","owner":"CpsiMapview.form.LayersMixin","id":"method-onWindowShow","meta":{}},{"name":"toggleLayerVisibility","tagname":"method","owner":"CpsiMapview.form.LayersMixin","id":"method-toggleLayerVisibility","meta":{}}],"code_type":"ext_define","id":"class-CpsiMapview.form.LayersMixin","component":false,"superclasses":["Ext.Mixin"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.Mixin<div class='subclass '><strong>CpsiMapview.form.LayersMixin</strong></div></div><h4>Requires</h4><div class='dependency'>BasiGX.util.Map</div><h4>Files</h4><div class='dependency'><a href='source/LayersMixin.html#CpsiMapview-form-LayersMixin' target='_blank'>LayersMixin.js</a></div></pre><div class='doc-contents'><p>A mixin to handle hiding and showing layers associated with an edit model</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-hideLayerWhenMinimized' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.LayersMixin'>CpsiMapview.form.LayersMixin</span><br/><a href='source/LayersMixin.html#CpsiMapview-form-LayersMixin-property-hideLayerWhenMinimized' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.LayersMixin-property-hideLayerWhenMinimized' class='name expandable'>hideLayerWhenMinimized</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>hide/show the form layer with the form ...</div><div class='long'><p>hide/show the form layer with the form</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='property-mixinConfig' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.LayersMixin'>CpsiMapview.form.LayersMixin</span><br/><a href='source/LayersMixin.html#CpsiMapview-form-LayersMixin-property-mixinConfig' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.LayersMixin-property-mixinConfig' class='name expandable'>mixinConfig</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>see https://docs.sencha.com/extjs/6.7.0/classic/Ext.Mixin.html ...</div><div class='long'><p>see https://docs.sencha.com/extjs/6.7.0/classic/Ext.Mixin.html</p>\n<p>Defaults to: <code>{after: {onShow: &#39;onWindowShow&#39;, onHide: &#39;onWindowHide&#39;, onMinimize: &#39;onWindowMinimize&#39;}}</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-onWindowHide' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.LayersMixin'>CpsiMapview.form.LayersMixin</span><br/><a href='source/LayersMixin.html#CpsiMapview-form-LayersMixin-method-onWindowHide' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.LayersMixin-method-onWindowHide' class='name expandable'>onWindowHide</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Hides the layers associated with the form when the\nform is hidden ...</div><div class='long'><p>Hides the layers associated with the form when the\nform is hidden</p>\n</div></div></div><div id='method-onWindowMinimize' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.LayersMixin'>CpsiMapview.form.LayersMixin</span><br/><a href='source/LayersMixin.html#CpsiMapview-form-LayersMixin-method-onWindowMinimize' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.LayersMixin-method-onWindowMinimize' class='name expandable'>onWindowMinimize</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Hides the layers associated with the form when the\nform is minimized ...</div><div class='long'><p>Hides the layers associated with the form when the\nform is minimized</p>\n</div></div></div><div id='method-onWindowShow' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.LayersMixin'>CpsiMapview.form.LayersMixin</span><br/><a href='source/LayersMixin.html#CpsiMapview-form-LayersMixin-method-onWindowShow' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.LayersMixin-method-onWindowShow' class='name expandable'>onWindowShow</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Show the layers associated with the form when the\nform is shown ...</div><div class='long'><p>Show the layers associated with the form when the\nform is shown</p>\n</div></div></div><div id='method-toggleLayerVisibility' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.LayersMixin'>CpsiMapview.form.LayersMixin</span><br/><a href='source/LayersMixin.html#CpsiMapview-form-LayersMixin-method-toggleLayerVisibility' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.LayersMixin-method-toggleLayerVisibility' class='name expandable'>toggleLayerVisibility</a>( <span class='pre'>show</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Changes the visibility of any of the layers associated\nwith the form (layers are defined in the viewmodel) ...</div><div class='long'><p>Changes the visibility of any of the layers associated\nwith the form (layers are defined in the viewmodel)</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>show</span> : boolean<div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});