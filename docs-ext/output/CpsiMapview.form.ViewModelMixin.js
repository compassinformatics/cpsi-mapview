Ext.data.JsonP.CpsiMapview_form_ViewModelMixin({"tagname":"class","name":"CpsiMapview.form.ViewModelMixin","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"ViewModelMixin.js","href":"ViewModelMixin.html#CpsiMapview-form-ViewModelMixin"}],"aliases":{},"alternateClassNames":[],"extends":"Ext.Mixin","mixins":[],"requires":["BasiGX.util.Map"],"uses":[],"members":[{"name":"formulas","tagname":"cfg","owner":"CpsiMapview.form.ViewModelMixin","id":"cfg-formulas","meta":{"private":true}},{"name":"mixinConfig","tagname":"property","owner":"CpsiMapview.form.ViewModelMixin","id":"property-mixinConfig","meta":{"private":true}},{"name":"destroyCurrentRecord","tagname":"method","owner":"CpsiMapview.form.ViewModelMixin","id":"method-destroyCurrentRecord","meta":{}},{"name":"getFeatureStore","tagname":"method","owner":"CpsiMapview.form.ViewModelMixin","id":"method-getFeatureStore","meta":{}},{"name":"getFormulas","tagname":"method","owner":"CpsiMapview.form.ViewModelMixin","id":"method-getFormulas","meta":{}},{"name":"onInitConfig","tagname":"method","owner":"CpsiMapview.form.ViewModelMixin","id":"method-onInitConfig","meta":{"private":true}},{"name":"setFormulas","tagname":"method","owner":"CpsiMapview.form.ViewModelMixin","id":"method-setFormulas","meta":{}}],"code_type":"ext_define","id":"class-CpsiMapview.form.ViewModelMixin","component":false,"superclasses":["Ext.Mixin"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.Mixin<div class='subclass '><strong>CpsiMapview.form.ViewModelMixin</strong></div></div><h4>Requires</h4><div class='dependency'>BasiGX.util.Map</div><h4>Files</h4><div class='dependency'><a href='source/ViewModelMixin.html#CpsiMapview-form-ViewModelMixin' target='_blank'>ViewModelMixin.js</a></div></pre><div class='doc-contents'><p>A mixin for an editing windows providing formulas that can be bound\nto the window model</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-formulas' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ViewModelMixin'>CpsiMapview.form.ViewModelMixin</span><br/><a href='source/ViewModelMixin.html#CpsiMapview-form-ViewModelMixin-cfg-formulas' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ViewModelMixin-cfg-formulas' class='name expandable'>formulas</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-mixinConfig' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ViewModelMixin'>CpsiMapview.form.ViewModelMixin</span><br/><a href='source/ViewModelMixin.html#CpsiMapview-form-ViewModelMixin-property-mixinConfig' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ViewModelMixin-property-mixinConfig' class='name expandable'>mixinConfig</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>{before: {destroy: &#39;destroyCurrentRecord&#39;}, after: {initConfig: &#39;onInitConfig&#39;}}</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-destroyCurrentRecord' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ViewModelMixin'>CpsiMapview.form.ViewModelMixin</span><br/><a href='source/ViewModelMixin.html#CpsiMapview-form-ViewModelMixin-method-destroyCurrentRecord' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ViewModelMixin-method-destroyCurrentRecord' class='name expandable'>destroyCurrentRecord</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Destroy the currently associated record ...</div><div class='long'><p>Destroy the currently associated record</p>\n</div></div></div><div id='method-getFeatureStore' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ViewModelMixin'>CpsiMapview.form.ViewModelMixin</span><br/><a href='source/ViewModelMixin.html#CpsiMapview-form-ViewModelMixin-method-getFeatureStore' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ViewModelMixin-method-getFeatureStore' class='name expandable'>getFeatureStore</a>( <span class='pre'>currentRecord, storeName</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Get a featurestore from the current record ...</div><div class='long'><p>Get a featurestore from the current record</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>currentRecord</span> : any<div class='sub-desc'>\n</div></li><li><span class='pre'>storeName</span> : any<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getFormulas' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ViewModelMixin'>CpsiMapview.form.ViewModelMixin</span><br/><a href='source/ViewModelMixin.html#CpsiMapview-form-ViewModelMixin-cfg-formulas' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ViewModelMixin-method-getFormulas' class='name expandable'>getFormulas</a>( <span class='pre'></span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns the value of formulas. ...</div><div class='long'><p>Returns the value of <a href=\"#!/api/CpsiMapview.form.ViewModelMixin-cfg-formulas\" rel=\"CpsiMapview.form.ViewModelMixin-cfg-formulas\" class=\"docClass\">formulas</a>.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-onInitConfig' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ViewModelMixin'>CpsiMapview.form.ViewModelMixin</span><br/><a href='source/ViewModelMixin.html#CpsiMapview-form-ViewModelMixin-method-onInitConfig' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ViewModelMixin-method-onInitConfig' class='name expandable'>onInitConfig</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-setFormulas' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ViewModelMixin'>CpsiMapview.form.ViewModelMixin</span><br/><a href='source/ViewModelMixin.html#CpsiMapview-form-ViewModelMixin-cfg-formulas' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ViewModelMixin-method-setFormulas' class='name expandable'>setFormulas</a>( <span class='pre'>formulas</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the value of formulas. ...</div><div class='long'><p>Sets the value of <a href=\"#!/api/CpsiMapview.form.ViewModelMixin-cfg-formulas\" rel=\"CpsiMapview.form.ViewModelMixin-cfg-formulas\" class=\"docClass\">formulas</a>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>formulas</span> : Object<div class='sub-desc'><p>The new value.</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});