Ext.data.JsonP.CpsiMapview_form_ControllerMixin({"tagname":"class","name":"CpsiMapview.form.ControllerMixin","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"ControllerMixin.js","href":"ControllerMixin.html#CpsiMapview-form-ControllerMixin"}],"aliases":{},"alternateClassNames":[],"extends":"Ext.Mixin","mixins":["CpsiMapview.form.ValidationMessagesMixin","CpsiMapview.util.ZoomerMixin"],"requires":[],"uses":[],"members":[{"name":"errorCodes","tagname":"property","owner":"CpsiMapview.form.ControllerMixin","id":"property-errorCodes","meta":{}},{"name":"zoomDefaults","tagname":"property","owner":"CpsiMapview.util.ZoomerMixin","id":"property-zoomDefaults","meta":{"private":true}},{"name":"checkValid","tagname":"method","owner":"CpsiMapview.form.ValidationMessagesMixin","id":"method-checkValid","meta":{"private":true}},{"name":"getResponseJson","tagname":"method","owner":"CpsiMapview.form.ControllerMixin","id":"method-getResponseJson","meta":{"private":true}},{"name":"onBeforeTabChange","tagname":"method","owner":"CpsiMapview.form.ControllerMixin","id":"method-onBeforeTabChange","meta":{}},{"name":"onCancelClick","tagname":"method","owner":"CpsiMapview.form.ControllerMixin","id":"method-onCancelClick","meta":{}},{"name":"onDelete","tagname":"method","owner":"CpsiMapview.form.ControllerMixin","id":"method-onDelete","meta":{}},{"name":"onDeleteCancel","tagname":"method","owner":"CpsiMapview.form.ControllerMixin","id":"method-onDeleteCancel","meta":{"private":true}},{"name":"onDeleteClick","tagname":"method","owner":"CpsiMapview.form.ControllerMixin","id":"method-onDeleteClick","meta":{}},{"name":"onDeleteFailed","tagname":"method","owner":"CpsiMapview.form.ControllerMixin","id":"method-onDeleteFailed","meta":{}},{"name":"onDeleteSucceeded","tagname":"method","owner":"CpsiMapview.form.ControllerMixin","id":"method-onDeleteSucceeded","meta":{}},{"name":"onExportClick","tagname":"method","owner":"CpsiMapview.form.ControllerMixin","id":"method-onExportClick","meta":{}},{"name":"onFieldChanged","tagname":"method","owner":"CpsiMapview.form.ControllerMixin","id":"method-onFieldChanged","meta":{"private":true}},{"name":"onRefreshClick","tagname":"method","owner":"CpsiMapview.form.ControllerMixin","id":"method-onRefreshClick","meta":{}},{"name":"onSaveClick","tagname":"method","owner":"CpsiMapview.form.ControllerMixin","id":"method-onSaveClick","meta":{}},{"name":"onSaveFailed","tagname":"method","owner":"CpsiMapview.form.ControllerMixin","id":"method-onSaveFailed","meta":{}},{"name":"onSaveSucceded","tagname":"method","owner":"CpsiMapview.form.ControllerMixin","id":"method-onSaveSucceded","meta":{}},{"name":"onZoomClick","tagname":"method","owner":"CpsiMapview.form.ControllerMixin","id":"method-onZoomClick","meta":{}},{"name":"reloadRecord","tagname":"method","owner":"CpsiMapview.form.ControllerMixin","id":"method-reloadRecord","meta":{}},{"name":"saveRecord","tagname":"method","owner":"CpsiMapview.form.ControllerMixin","id":"method-saveRecord","meta":{}},{"name":"updateValidationMessages","tagname":"method","owner":"CpsiMapview.form.ValidationMessagesMixin","id":"method-updateValidationMessages","meta":{"private":true}},{"name":"zoomMap","tagname":"method","owner":"CpsiMapview.util.ZoomerMixin","id":"method-zoomMap","meta":{}},{"name":"zoomToBounds","tagname":"method","owner":"CpsiMapview.util.ZoomerMixin","id":"method-zoomToBounds","meta":{}},{"name":"zoomToExtentUsingService","tagname":"method","owner":"CpsiMapview.util.ZoomerMixin","id":"method-zoomToExtentUsingService","meta":{}},{"name":"zoomToRecordExtent","tagname":"method","owner":"CpsiMapview.util.ZoomerMixin","id":"method-zoomToRecordExtent","meta":{}}],"code_type":"ext_define","id":"class-CpsiMapview.form.ControllerMixin","component":false,"superclasses":["Ext.Mixin"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.Mixin<div class='subclass '><strong>CpsiMapview.form.ControllerMixin</strong></div></div><h4>Mixins</h4><div class='dependency'><a href='#!/api/CpsiMapview.form.ValidationMessagesMixin' rel='CpsiMapview.form.ValidationMessagesMixin' class='docClass'>CpsiMapview.form.ValidationMessagesMixin</a></div><div class='dependency'><a href='#!/api/CpsiMapview.util.ZoomerMixin' rel='CpsiMapview.util.ZoomerMixin' class='docClass'>CpsiMapview.util.ZoomerMixin</a></div><h4>Files</h4><div class='dependency'><a href='source/ControllerMixin.html#CpsiMapview-form-ControllerMixin' target='_blank'>ControllerMixin.js</a></div></pre><div class='doc-contents'><p>A mixin for any edit window controller allowing for\nvalidation, saving, deletion, exports etc.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-errorCodes' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ControllerMixin'>CpsiMapview.form.ControllerMixin</span><br/><a href='source/ControllerMixin.html#CpsiMapview-form-ControllerMixin-property-errorCodes' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ControllerMixin-property-errorCodes' class='name expandable'>errorCodes</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>The possible return codes from the services ...</div><div class='long'><p>The possible return codes from the services</p>\n<p>Defaults to: <code>{None: 0, AccountLockedOut: 1, AccountDoesNotExist: 2, UserTokenExpired: 3, CookieHeaderMissing: 4, NoPermission: 5, GeneralServerError: 500, FileNotFound: 404}</code></p></div></div></div><div id='property-zoomDefaults' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CpsiMapview.util.ZoomerMixin' rel='CpsiMapview.util.ZoomerMixin' class='defined-in docClass'>CpsiMapview.util.ZoomerMixin</a><br/><a href='source/ZoomerMixin.html#CpsiMapview-util-ZoomerMixin-property-zoomDefaults' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ZoomerMixin-property-zoomDefaults' class='name expandable'>zoomDefaults</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>{duration: 20}</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-checkValid' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CpsiMapview.form.ValidationMessagesMixin' rel='CpsiMapview.form.ValidationMessagesMixin' class='defined-in docClass'>CpsiMapview.form.ValidationMessagesMixin</a><br/><a href='source/ValidationMessagesMixin.html#CpsiMapview-form-ValidationMessagesMixin-method-checkValid' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ValidationMessagesMixin-method-checkValid' class='name expandable'>checkValid</a>( <span class='pre'>rec</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>rec</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-getResponseJson' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ControllerMixin'>CpsiMapview.form.ControllerMixin</span><br/><a href='source/ControllerMixin.html#CpsiMapview-form-ControllerMixin-method-getResponseJson' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ControllerMixin-method-getResponseJson' class='name expandable'>getResponseJson</a>( <span class='pre'>operation</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>operation</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-onBeforeTabChange' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ControllerMixin'>CpsiMapview.form.ControllerMixin</span><br/><a href='source/ControllerMixin.html#CpsiMapview-form-ControllerMixin-method-onBeforeTabChange' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ControllerMixin-method-onBeforeTabChange' class='name expandable'>onBeforeTabChange</a>( <span class='pre'>tabPanel, newCard, oldCard</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Do not allow the tab to change if a grid is currently\nbeing edited (the wrong data could be saved) ...</div><div class='long'><p>Do not allow the tab to change if a grid is currently\nbeing edited (the wrong data could be saved)</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>tabPanel</span> : any<div class='sub-desc'>\n</div></li><li><span class='pre'>newCard</span> : any<div class='sub-desc'>\n</div></li><li><span class='pre'>oldCard</span> : any<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-onCancelClick' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ControllerMixin'>CpsiMapview.form.ControllerMixin</span><br/><a href='source/ControllerMixin.html#CpsiMapview-form-ControllerMixin-method-onCancelClick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ControllerMixin-method-onCancelClick' class='name expandable'>onCancelClick</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Action when the cancel button is clicked ...</div><div class='long'><p>Action when the cancel button is clicked</p>\n</div></div></div><div id='method-onDelete' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ControllerMixin'>CpsiMapview.form.ControllerMixin</span><br/><a href='source/ControllerMixin.html#CpsiMapview-form-ControllerMixin-method-onDelete' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ControllerMixin-method-onDelete' class='name expandable'>onDelete</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Action for deletion ...</div><div class='long'><p>Action for deletion</p>\n</div></div></div><div id='method-onDeleteCancel' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ControllerMixin'>CpsiMapview.form.ControllerMixin</span><br/><a href='source/ControllerMixin.html#CpsiMapview-form-ControllerMixin-method-onDeleteCancel' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ControllerMixin-method-onDeleteCancel' class='name expandable'>onDeleteCancel</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-onDeleteClick' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ControllerMixin'>CpsiMapview.form.ControllerMixin</span><br/><a href='source/ControllerMixin.html#CpsiMapview-form-ControllerMixin-method-onDeleteClick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ControllerMixin-method-onDeleteClick' class='name expandable'>onDeleteClick</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Action when the delete button is clicked ...</div><div class='long'><p>Action when the delete button is clicked</p>\n</div></div></div><div id='method-onDeleteFailed' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ControllerMixin'>CpsiMapview.form.ControllerMixin</span><br/><a href='source/ControllerMixin.html#CpsiMapview-form-ControllerMixin-method-onDeleteFailed' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ControllerMixin-method-onDeleteFailed' class='name expandable'>onDeleteFailed</a>( <span class='pre'>record, operation</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Action when a delete fails ...</div><div class='long'><p>Action when a delete fails</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>record</span> : any<div class='sub-desc'>\n</div></li><li><span class='pre'>operation</span> : any<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-onDeleteSucceeded' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ControllerMixin'>CpsiMapview.form.ControllerMixin</span><br/><a href='source/ControllerMixin.html#CpsiMapview-form-ControllerMixin-method-onDeleteSucceeded' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ControllerMixin-method-onDeleteSucceeded' class='name expandable'>onDeleteSucceeded</a>( <span class='pre'>record</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Action when a delete succeeds ...</div><div class='long'><p>Action when a delete succeeds</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>record</span> : any<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-onExportClick' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ControllerMixin'>CpsiMapview.form.ControllerMixin</span><br/><a href='source/ControllerMixin.html#CpsiMapview-form-ControllerMixin-method-onExportClick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ControllerMixin-method-onExportClick' class='name expandable'>onExportClick</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Action when the export button is clicked ...</div><div class='long'><p>Action when the export button is clicked</p>\n</div></div></div><div id='method-onFieldChanged' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ControllerMixin'>CpsiMapview.form.ControllerMixin</span><br/><a href='source/ControllerMixin.html#CpsiMapview-form-ControllerMixin-method-onFieldChanged' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ControllerMixin-method-onFieldChanged' class='name expandable'>onFieldChanged</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-onRefreshClick' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ControllerMixin'>CpsiMapview.form.ControllerMixin</span><br/><a href='source/ControllerMixin.html#CpsiMapview-form-ControllerMixin-method-onRefreshClick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ControllerMixin-method-onRefreshClick' class='name expandable'>onRefreshClick</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Allow a record to be reloaded from the server ...</div><div class='long'><p>Allow a record to be reloaded from the server</p>\n</div></div></div><div id='method-onSaveClick' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ControllerMixin'>CpsiMapview.form.ControllerMixin</span><br/><a href='source/ControllerMixin.html#CpsiMapview-form-ControllerMixin-method-onSaveClick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ControllerMixin-method-onSaveClick' class='name expandable'>onSaveClick</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Action when the save button is clicked ...</div><div class='long'><p>Action when the save button is clicked</p>\n</div></div></div><div id='method-onSaveFailed' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ControllerMixin'>CpsiMapview.form.ControllerMixin</span><br/><a href='source/ControllerMixin.html#CpsiMapview-form-ControllerMixin-method-onSaveFailed' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ControllerMixin-method-onSaveFailed' class='name expandable'>onSaveFailed</a>( <span class='pre'>record, operation</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Action when save fails ...</div><div class='long'><p>Action when save fails</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>record</span> : any<div class='sub-desc'>\n</div></li><li><span class='pre'>operation</span> : any<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-onSaveSucceded' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ControllerMixin'>CpsiMapview.form.ControllerMixin</span><br/><a href='source/ControllerMixin.html#CpsiMapview-form-ControllerMixin-method-onSaveSucceded' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ControllerMixin-method-onSaveSucceded' class='name expandable'>onSaveSucceded</a>( <span class='pre'>record, operation</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Action when save succeeds ...</div><div class='long'><p>Action when save succeeds</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>record</span> : any<div class='sub-desc'>\n</div></li><li><span class='pre'>operation</span> : any<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-onZoomClick' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ControllerMixin'>CpsiMapview.form.ControllerMixin</span><br/><a href='source/ControllerMixin.html#CpsiMapview-form-ControllerMixin-method-onZoomClick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ControllerMixin-method-onZoomClick' class='name expandable'>onZoomClick</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Action when the zoom button is clicked ...</div><div class='long'><p>Action when the zoom button is clicked</p>\n</div></div></div><div id='method-reloadRecord' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ControllerMixin'>CpsiMapview.form.ControllerMixin</span><br/><a href='source/ControllerMixin.html#CpsiMapview-form-ControllerMixin-method-reloadRecord' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ControllerMixin-method-reloadRecord' class='name expandable'>reloadRecord</a>( <span class='pre'>serverRec</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Reload a record with fresh data from the server ...</div><div class='long'><p>Reload a record with fresh data from the server</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>serverRec</span> : any<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-saveRecord' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.form.ControllerMixin'>CpsiMapview.form.ControllerMixin</span><br/><a href='source/ControllerMixin.html#CpsiMapview-form-ControllerMixin-method-saveRecord' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ControllerMixin-method-saveRecord' class='name expandable'>saveRecord</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Save the current record to the server ...</div><div class='long'><p>Save the current record to the server</p>\n</div></div></div><div id='method-updateValidationMessages' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CpsiMapview.form.ValidationMessagesMixin' rel='CpsiMapview.form.ValidationMessagesMixin' class='defined-in docClass'>CpsiMapview.form.ValidationMessagesMixin</a><br/><a href='source/ValidationMessagesMixin.html#CpsiMapview-form-ValidationMessagesMixin-method-updateValidationMessages' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.form.ValidationMessagesMixin-method-updateValidationMessages' class='name expandable'>updateValidationMessages</a>( <span class='pre'>rec</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>rec</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-zoomMap' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CpsiMapview.util.ZoomerMixin' rel='CpsiMapview.util.ZoomerMixin' class='defined-in docClass'>CpsiMapview.util.ZoomerMixin</a><br/><a href='source/ZoomerMixin.html#CpsiMapview-util-ZoomerMixin-method-zoomMap' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ZoomerMixin-method-zoomMap' class='name expandable'>zoomMap</a>( <span class='pre'>extent, options</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Zoom the map object to the extent of the layer\nSee https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#f...</div><div class='long'><p>Zoom the map object to the extent of the layer\nSee https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#fit\nfor options</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>extent</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>options</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-zoomToBounds' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CpsiMapview.util.ZoomerMixin' rel='CpsiMapview.util.ZoomerMixin' class='defined-in docClass'>CpsiMapview.util.ZoomerMixin</a><br/><a href='source/ZoomerMixin.html#CpsiMapview-util-ZoomerMixin-method-zoomToBounds' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ZoomerMixin-method-zoomToBounds' class='name expandable'>zoomToBounds</a>( <span class='pre'>data</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Zoom to extent using a JSON object with bbox in epsg:3857 ...</div><div class='long'><p>Zoom to extent using a JSON object with bbox in epsg:3857</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-zoomToExtentUsingService' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CpsiMapview.util.ZoomerMixin' rel='CpsiMapview.util.ZoomerMixin' class='defined-in docClass'>CpsiMapview.util.ZoomerMixin</a><br/><a href='source/ZoomerMixin.html#CpsiMapview-util-ZoomerMixin-method-zoomToExtentUsingService' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ZoomerMixin-method-zoomToExtentUsingService' class='name expandable'>zoomToExtentUsingService</a>( <span class='pre'>url, id</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Zoom using a bbox provided by the .NET services ...</div><div class='long'><p>Zoom using a bbox provided by the .NET services</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>url</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>id</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-zoomToRecordExtent' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CpsiMapview.util.ZoomerMixin' rel='CpsiMapview.util.ZoomerMixin' class='defined-in docClass'>CpsiMapview.util.ZoomerMixin</a><br/><a href='source/ZoomerMixin.html#CpsiMapview-util-ZoomerMixin-method-zoomToRecordExtent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ZoomerMixin-method-zoomToRecordExtent' class='name expandable'>zoomToRecordExtent</a>( <span class='pre'>options</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Zoom the map object to the extent of the layer\nSee https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#f...</div><div class='long'><p>Zoom the map object to the extent of the layer\nSee https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#fit\nfor options</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>options</span> : Object<div class='sub-desc'></div></li></ul></div></div></div></div></div></div></div>","meta":{}});