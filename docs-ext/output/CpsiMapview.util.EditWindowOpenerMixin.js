Ext.data.JsonP.CpsiMapview_util_EditWindowOpenerMixin({"tagname":"class","name":"CpsiMapview.util.EditWindowOpenerMixin","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"EditWindowOpenerMixin.js","href":"EditWindowOpenerMixin.html#CpsiMapview-util-EditWindowOpenerMixin"}],"aliases":{},"alternateClassNames":[],"extends":"Ext.Mixin","mixins":[],"requires":[],"uses":[],"members":[{"name":"getEditingFormWindow","tagname":"method","owner":"CpsiMapview.util.EditWindowOpenerMixin","id":"method-getEditingFormWindow","meta":{}},{"name":"getExistingEditingFormWindow","tagname":"method","owner":"CpsiMapview.util.EditWindowOpenerMixin","id":"method-getExistingEditingFormWindow","meta":{}}],"code_type":"ext_define","id":"class-CpsiMapview.util.EditWindowOpenerMixin","component":false,"superclasses":["Ext.Mixin"],"subclasses":[],"mixedInto":["CpsiMapview.controller.MapController"],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.Mixin<div class='subclass '><strong>CpsiMapview.util.EditWindowOpenerMixin</strong></div></div><h4>Mixed into</h4><div class='dependency'><a href='#!/api/CpsiMapview.controller.MapController' rel='CpsiMapview.controller.MapController' class='docClass'>CpsiMapview.controller.MapController</a></div><h4>Files</h4><div class='dependency'><a href='source/EditWindowOpenerMixin.html#CpsiMapview-util-EditWindowOpenerMixin' target='_blank'>EditWindowOpenerMixin.js</a></div></pre><div class='doc-contents'><p>A mixin for any menu controller or window controller which\nneeds to check if a model is already opened in a window.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-getEditingFormWindow' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.EditWindowOpenerMixin'>CpsiMapview.util.EditWindowOpenerMixin</span><br/><a href='source/EditWindowOpenerMixin.html#CpsiMapview-util-EditWindowOpenerMixin-method-getEditingFormWindow' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.EditWindowOpenerMixin-method-getEditingFormWindow' class='name expandable'>getEditingFormWindow</a>( <span class='pre'>record, editWindowType</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Return the existing window for the given record if it already exists\nor a new window if not ...</div><div class='long'><p>Return the existing window for the given record if it already exists\nor a new window if not</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>record</span> : any<div class='sub-desc'><p>the model to open</p>\n</div></li><li><span class='pre'>editWindowType</span> : any<div class='sub-desc'><p>the window in which to open the model</p>\n</div></li></ul></div></div></div><div id='method-getExistingEditingFormWindow' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.EditWindowOpenerMixin'>CpsiMapview.util.EditWindowOpenerMixin</span><br/><a href='source/EditWindowOpenerMixin.html#CpsiMapview-util-EditWindowOpenerMixin-method-getExistingEditingFormWindow' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.EditWindowOpenerMixin-method-getExistingEditingFormWindow' class='name expandable'>getExistingEditingFormWindow</a>( <span class='pre'>recId, editWindowType</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Find an existing window based on a record id ...</div><div class='long'><p>Find an existing window based on a record id</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>recId</span> : any<div class='sub-desc'>\n</div></li><li><span class='pre'>editWindowType</span> : any<div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});