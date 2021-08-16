Ext.data.JsonP.CpsiMapview_view_fileupload_FileGridController({"tagname":"class","name":"CpsiMapview.view.fileupload.FileGridController","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"FileGridController.js","href":"FileGridController.html#CpsiMapview-view-fileupload-FileGridController"}],"aliases":{"controller":["cmv_filegridcontroller"]},"alternateClassNames":[],"extends":"Ext.app.ViewController","mixins":["CpsiMapview.controller.grid.ItemDeleterGridControllerMixin"],"requires":["CpsiMapview.model.fileupload.Attachment","CpsiMapview.view.fileupload.FileUploadWindow","CpsiMapview.view.fileupload.Report"],"uses":[],"members":[{"name":"beforeDelete","tagname":"method","owner":"CpsiMapview.controller.grid.ItemDeleterGridControllerMixin","id":"method-beforeDelete","meta":{"private":true}},{"name":"onAddFileClick","tagname":"method","owner":"CpsiMapview.view.fileupload.FileGridController","id":"method-onAddFileClick","meta":{}},{"name":"onDeleteRowClick","tagname":"method","owner":"CpsiMapview.controller.grid.ItemDeleterGridControllerMixin","id":"method-onDeleteRowClick","meta":{"private":true}},{"name":"onDownloadFileClick","tagname":"method","owner":"CpsiMapview.view.fileupload.FileGridController","id":"method-onDownloadFileClick","meta":{}},{"name":"onFileAdded","tagname":"method","owner":"CpsiMapview.view.fileupload.FileGridController","id":"method-onFileAdded","meta":{}},{"name":"onRowDelete","tagname":"method","owner":"CpsiMapview.view.fileupload.FileGridController","id":"method-onRowDelete","meta":{}},{"name":"onRowDeleteCallback","tagname":"method","owner":"CpsiMapview.controller.grid.ItemDeleterGridControllerMixin","id":"method-onRowDeleteCallback","meta":{"private":true}},{"name":"onRowDeleteCancelled","tagname":"method","owner":"CpsiMapview.controller.grid.ItemDeleterGridControllerMixin","id":"method-onRowDeleteCancelled","meta":{}},{"name":"onRowDeleteFail","tagname":"method","owner":"CpsiMapview.controller.grid.ItemDeleterGridControllerMixin","id":"method-onRowDeleteFail","meta":{"private":true}},{"name":"onRowDeleteSuccess","tagname":"method","owner":"CpsiMapview.controller.grid.ItemDeleterGridControllerMixin","id":"method-onRowDeleteSuccess","meta":{"private":true}},{"name":"openImageInWindow","tagname":"method","owner":"CpsiMapview.view.fileupload.FileGridController","id":"method-openImageInWindow","meta":{}}],"code_type":"ext_define","id":"class-CpsiMapview.view.fileupload.FileGridController","component":false,"superclasses":["Ext.app.ViewController"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.app.ViewController<div class='subclass '><strong>CpsiMapview.view.fileupload.FileGridController</strong></div></div><h4>Mixins</h4><div class='dependency'><a href='#!/api/CpsiMapview.controller.grid.ItemDeleterGridControllerMixin' rel='CpsiMapview.controller.grid.ItemDeleterGridControllerMixin' class='docClass'>CpsiMapview.controller.grid.ItemDeleterGridControllerMixin</a></div><h4>Requires</h4><div class='dependency'><a href='#!/api/CpsiMapview.model.fileupload.Attachment' rel='CpsiMapview.model.fileupload.Attachment' class='docClass'>CpsiMapview.model.fileupload.Attachment</a></div><div class='dependency'><a href='#!/api/CpsiMapview.view.fileupload.FileUploadWindow' rel='CpsiMapview.view.fileupload.FileUploadWindow' class='docClass'>CpsiMapview.view.fileupload.FileUploadWindow</a></div><div class='dependency'><a href='#!/api/CpsiMapview.view.fileupload.Report' rel='CpsiMapview.view.fileupload.Report' class='docClass'>CpsiMapview.view.fileupload.Report</a></div><h4>Files</h4><div class='dependency'><a href='source/FileGridController.html#CpsiMapview-view-fileupload-FileGridController' target='_blank'>FileGridController.js</a></div></pre><div class='doc-contents'><p>Controller for the grid used to display a collection of attachments</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-beforeDelete' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CpsiMapview.controller.grid.ItemDeleterGridControllerMixin' rel='CpsiMapview.controller.grid.ItemDeleterGridControllerMixin' class='defined-in docClass'>CpsiMapview.controller.grid.ItemDeleterGridControllerMixin</a><br/><a href='source/ItemDeleterGridControllerMixin.html#CpsiMapview-controller-grid-ItemDeleterGridControllerMixin-method-beforeDelete' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.ItemDeleterGridControllerMixin-method-beforeDelete' class='name expandable'>beforeDelete</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-onAddFileClick' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.fileupload.FileGridController'>CpsiMapview.view.fileupload.FileGridController</span><br/><a href='source/FileGridController.html#CpsiMapview-view-fileupload-FileGridController-method-onAddFileClick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.fileupload.FileGridController-method-onAddFileClick' class='name expandable'>onAddFileClick</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Open the modal form for adding a new file attachment ...</div><div class='long'><p>Open the modal form for adding a new file attachment</p>\n</div></div></div><div id='method-onDeleteRowClick' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CpsiMapview.controller.grid.ItemDeleterGridControllerMixin' rel='CpsiMapview.controller.grid.ItemDeleterGridControllerMixin' class='defined-in docClass'>CpsiMapview.controller.grid.ItemDeleterGridControllerMixin</a><br/><a href='source/ItemDeleterGridControllerMixin.html#CpsiMapview-controller-grid-ItemDeleterGridControllerMixin-method-onDeleteRowClick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.ItemDeleterGridControllerMixin-method-onDeleteRowClick' class='name expandable'>onDeleteRowClick</a>( <span class='pre'>tableView, rowIndex, colIndex, item, e, record, tableRow</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>tableView</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>rowIndex</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>colIndex</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>item</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>e</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>record</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>tableRow</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-onDownloadFileClick' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.fileupload.FileGridController'>CpsiMapview.view.fileupload.FileGridController</span><br/><a href='source/FileGridController.html#CpsiMapview-view-fileupload-FileGridController-method-onDownloadFileClick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.fileupload.FileGridController-method-onDownloadFileClick' class='name expandable'>onDownloadFileClick</a>( <span class='pre'>grid, record</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>When double clicking a file attachment open in a\nwindow for images, or download directly for other file types ...</div><div class='long'><p>When double clicking a file attachment open in a\nwindow for images, or download directly for other file types</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>grid</span> : any<div class='sub-desc'>\n</div></li><li><span class='pre'>record</span> : any<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-onFileAdded' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.fileupload.FileGridController'>CpsiMapview.view.fileupload.FileGridController</span><br/><a href='source/FileGridController.html#CpsiMapview-view-fileupload-FileGridController-method-onFileAdded' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.fileupload.FileGridController-method-onFileAdded' class='name expandable'>onFileAdded</a>( <span class='pre'>file</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Add a new attachment to the grid ...</div><div class='long'><p>Add a new attachment to the grid</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>file</span> : any<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-onRowDelete' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.fileupload.FileGridController'>CpsiMapview.view.fileupload.FileGridController</span><br/><a href='source/FileGridController.html#CpsiMapview-view-fileupload-FileGridController-method-onRowDelete' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.fileupload.FileGridController-method-onRowDelete' class='name expandable'>onRowDelete</a>( <span class='pre'>tableView, rowIndex, colIndex, item, e, record</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Delete an attachment from the server and removed from the grid ...</div><div class='long'><p>Delete an attachment from the server and removed from the grid</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>tableView</span> : any<div class='sub-desc'>\n</div></li><li><span class='pre'>rowIndex</span> : any<div class='sub-desc'>\n</div></li><li><span class='pre'>colIndex</span> : any<div class='sub-desc'>\n</div></li><li><span class='pre'>item</span> : any<div class='sub-desc'>\n</div></li><li><span class='pre'>e</span> : any<div class='sub-desc'>\n</div></li><li><span class='pre'>record</span> : any<div class='sub-desc'>\n</div></li></ul><p>Overrides: <a href=\"#!/api/CpsiMapview.controller.grid.ItemDeleterGridControllerMixin-method-onRowDelete\" rel=\"CpsiMapview.controller.grid.ItemDeleterGridControllerMixin-method-onRowDelete\" class=\"docClass\">CpsiMapview.controller.grid.ItemDeleterGridControllerMixin.onRowDelete</a></p></div></div></div><div id='method-onRowDeleteCallback' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CpsiMapview.controller.grid.ItemDeleterGridControllerMixin' rel='CpsiMapview.controller.grid.ItemDeleterGridControllerMixin' class='defined-in docClass'>CpsiMapview.controller.grid.ItemDeleterGridControllerMixin</a><br/><a href='source/ItemDeleterGridControllerMixin.html#CpsiMapview-controller-grid-ItemDeleterGridControllerMixin-method-onRowDeleteCallback' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.ItemDeleterGridControllerMixin-method-onRowDeleteCallback' class='name expandable'>onRowDeleteCallback</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-onRowDeleteCancelled' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CpsiMapview.controller.grid.ItemDeleterGridControllerMixin' rel='CpsiMapview.controller.grid.ItemDeleterGridControllerMixin' class='defined-in docClass'>CpsiMapview.controller.grid.ItemDeleterGridControllerMixin</a><br/><a href='source/ItemDeleterGridControllerMixin.html#CpsiMapview-controller-grid-ItemDeleterGridControllerMixin-method-onRowDeleteCancelled' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.ItemDeleterGridControllerMixin-method-onRowDeleteCancelled' class='name expandable'>onRowDeleteCancelled</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Function to run when delete is cancelled by the user or by business logic. ...</div><div class='long'><p>Function to run when delete is cancelled by the user or by business logic. Override this as required.</p>\n</div></div></div><div id='method-onRowDeleteFail' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CpsiMapview.controller.grid.ItemDeleterGridControllerMixin' rel='CpsiMapview.controller.grid.ItemDeleterGridControllerMixin' class='defined-in docClass'>CpsiMapview.controller.grid.ItemDeleterGridControllerMixin</a><br/><a href='source/ItemDeleterGridControllerMixin.html#CpsiMapview-controller-grid-ItemDeleterGridControllerMixin-method-onRowDeleteFail' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.ItemDeleterGridControllerMixin-method-onRowDeleteFail' class='name expandable'>onRowDeleteFail</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-onRowDeleteSuccess' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CpsiMapview.controller.grid.ItemDeleterGridControllerMixin' rel='CpsiMapview.controller.grid.ItemDeleterGridControllerMixin' class='defined-in docClass'>CpsiMapview.controller.grid.ItemDeleterGridControllerMixin</a><br/><a href='source/ItemDeleterGridControllerMixin.html#CpsiMapview-controller-grid-ItemDeleterGridControllerMixin-method-onRowDeleteSuccess' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.controller.grid.ItemDeleterGridControllerMixin-method-onRowDeleteSuccess' class='name expandable'>onRowDeleteSuccess</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-openImageInWindow' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.view.fileupload.FileGridController'>CpsiMapview.view.fileupload.FileGridController</span><br/><a href='source/FileGridController.html#CpsiMapview-view-fileupload-FileGridController-method-openImageInWindow' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.view.fileupload.FileGridController-method-openImageInWindow' class='name expandable'>openImageInWindow</a>( <span class='pre'>record</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Open an image attachment in a floating window ...</div><div class='long'><p>Open an image attachment in a floating window</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>record</span> : any<div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});