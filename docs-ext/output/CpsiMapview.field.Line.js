Ext.data.JsonP.CpsiMapview_field_Line({"tagname":"class","name":"CpsiMapview.field.Line","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"Line.js","href":"Line.html#CpsiMapview-field-Line"}],"aliases":{"data":["field.line"]},"alternateClassNames":[],"extends":"CpsiMapview.field.Feature","mixins":[],"requires":[],"uses":[],"members":[{"name":"allowNull","tagname":"property","owner":"CpsiMapview.field.Feature","id":"property-allowNull","meta":{"private":true}},{"name":"persist","tagname":"property","owner":"CpsiMapview.field.Feature","id":"property-persist","meta":{"private":true}},{"name":"selectStyleDefaults","tagname":"property","owner":"CpsiMapview.field.Line","id":"property-selectStyleDefaults","meta":{}},{"name":"styleDefaults","tagname":"property","owner":"CpsiMapview.field.Line","id":"property-styleDefaults","meta":{}},{"name":"convert","tagname":"method","owner":"CpsiMapview.field.Feature","id":"method-convert","meta":{}},{"name":"createPointLineStyle","tagname":"method","owner":"CpsiMapview.field.Line","id":"method-createPointLineStyle","meta":{}},{"name":"createSelectStyle","tagname":"method","owner":"CpsiMapview.field.Line","id":"method-createSelectStyle","meta":{}},{"name":"createStyle","tagname":"method","owner":"CpsiMapview.field.Line","id":"method-createStyle","meta":{}},{"name":"defaultFeatureFilter","tagname":"method","owner":"CpsiMapview.field.Line","id":"method-defaultFeatureFilter","meta":{}},{"name":"getFeatureAttributes","tagname":"method","owner":"CpsiMapview.field.Line","id":"method-getFeatureAttributes","meta":{}},{"name":"serialize","tagname":"method","owner":"CpsiMapview.field.Line","id":"method-serialize","meta":{}}],"code_type":"ext_define","id":"class-CpsiMapview.field.Line","short_doc":"A custom field for storing line features\nThe field handles loading and serializing features to and from an associated...","component":false,"superclasses":["Ext.data.field.Field","CpsiMapview.field.Feature"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.data.field.Field<div class='subclass '><a href='#!/api/CpsiMapview.field.Feature' rel='CpsiMapview.field.Feature' class='docClass'>CpsiMapview.field.Feature</a><div class='subclass '><strong>CpsiMapview.field.Line</strong></div></div></div><h4>Files</h4><div class='dependency'><a href='source/Line.html#CpsiMapview-field-Line' target='_blank'>Line.js</a></div></pre><div class='doc-contents'><p>A custom field for storing line features\nThe field handles loading and serializing features to and from an associated store.\nThe linked map layer can have styling properties customized through field properties.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-allowNull' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CpsiMapview.field.Feature' rel='CpsiMapview.field.Feature' class='defined-in docClass'>CpsiMapview.field.Feature</a><br/><a href='source/Feature.html#CpsiMapview-field-Feature-property-allowNull' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.field.Feature-property-allowNull' class='name expandable'>allowNull</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='property-persist' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CpsiMapview.field.Feature' rel='CpsiMapview.field.Feature' class='defined-in docClass'>CpsiMapview.field.Feature</a><br/><a href='source/Feature.html#CpsiMapview-field-Feature-property-persist' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.field.Feature-property-persist' class='name expandable'>persist</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>ensure the data is sent to the server\nhttps://docs.sencha.com/extjs/6.7.0/modern/Ext.data.field.Field.html#cfg-persist ...</div><div class='long'><p>ensure the data is sent to the server\nhttps://docs.sencha.com/extjs/6.7.0/modern/Ext.data.field.Field.html#cfg-persist</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='property-selectStyleDefaults' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.field.Line'>CpsiMapview.field.Line</span><br/><a href='source/Line.html#CpsiMapview-field-Line-property-selectStyleDefaults' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.field.Line-property-selectStyleDefaults' class='name expandable'>selectStyleDefaults</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Colors and sizes for the point and line selection styles ...</div><div class='long'><p>Colors and sizes for the point and line selection styles</p>\n<p>Defaults to: <code>{lineColor: &#39;red&#39;, pointColor: &#39;red&#39;}</code></p></div></div></div><div id='property-styleDefaults' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.field.Line'>CpsiMapview.field.Line</span><br/><a href='source/Line.html#CpsiMapview-field-Line-property-styleDefaults' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.field.Line-property-styleDefaults' class='name expandable'>styleDefaults</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Colors and sizes for the default point and line styles ...</div><div class='long'><p>Colors and sizes for the default point and line styles</p>\n<p>Defaults to: <code>{lineColor: &#39;#FFFC17&#39;, pointColor: &#39;#E9AB17&#39;, radius: 5, width: 4}</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-convert' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CpsiMapview.field.Feature' rel='CpsiMapview.field.Feature' class='defined-in docClass'>CpsiMapview.field.Feature</a><br/><a href='source/Feature.html#CpsiMapview-field-Feature-method-convert' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.field.Feature-method-convert' class='name expandable'>convert</a>( <span class='pre'>data, rec</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Load GeoJSON features into the field's feature store ...</div><div class='long'><p>Load GeoJSON features into the field's feature store</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>rec</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-createPointLineStyle' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.field.Line'>CpsiMapview.field.Line</span><br/><a href='source/Line.html#CpsiMapview-field-Line-method-createPointLineStyle' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.field.Line-method-createPointLineStyle' class='name expandable'>createPointLineStyle</a>( <span class='pre'>lineColor, pointColor</span> ) : ol.style.Style<span class=\"signature\"></span></div><div class='description'><div class='short'>Create a new ol style for showing points and lines ...</div><div class='long'><p>Create a new ol style for showing points and lines</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>lineColor</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>pointColor</span> : Object<div class='sub-desc'></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>ol.style.Style</span><div class='sub-desc'><p>The new style</p>\n</div></li></ul></div></div></div><div id='method-createSelectStyle' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.field.Line'>CpsiMapview.field.Line</span><br/><a href='source/Line.html#CpsiMapview-field-Line-method-createSelectStyle' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.field.Line-method-createSelectStyle' class='name expandable'>createSelectStyle</a>( <span class='pre'></span> ) : ol.style.Style<span class=\"signature\"></span></div><div class='description'><div class='short'>Create a new ol style for showing points and lines when selected ...</div><div class='long'><p>Create a new ol style for showing points and lines when selected</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>ol.style.Style</span><div class='sub-desc'><p>The new style</p>\n</div></li></ul></div></div></div><div id='method-createStyle' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.field.Line'>CpsiMapview.field.Line</span><br/><a href='source/Line.html#CpsiMapview-field-Line-method-createStyle' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.field.Line-method-createStyle' class='name expandable'>createStyle</a>( <span class='pre'></span> ) : ol.style.Style<span class=\"signature\"></span></div><div class='description'><div class='short'>Create a new ol style ...</div><div class='long'><p>Create a new ol style</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>ol.style.Style</span><div class='sub-desc'><p>The new style</p>\n</div></li></ul></div></div></div><div id='method-defaultFeatureFilter' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.field.Line'>CpsiMapview.field.Line</span><br/><a href='source/Line.html#CpsiMapview-field-Line-method-defaultFeatureFilter' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.field.Line-method-defaultFeatureFilter' class='name expandable'>defaultFeatureFilter</a>( <span class='pre'>rec</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Filter to apply to the feature store ...</div><div class='long'><p>Filter to apply to the feature store</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>rec</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-getFeatureAttributes' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.field.Line'>CpsiMapview.field.Line</span><br/><a href='source/Line.html#CpsiMapview-field-Line-method-getFeatureAttributes' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.field.Line-method-getFeatureAttributes' class='name expandable'>getFeatureAttributes</a>( <span class='pre'>featureStore</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Create an array containing feature properties ...</div><div class='long'><p>Create an array containing feature properties</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>featureStore</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-serialize' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.field.Line'>CpsiMapview.field.Line</span><br/><a href='source/Line.html#CpsiMapview-field-Line-method-serialize' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.field.Line-method-serialize' class='name expandable'>serialize</a>( <span class='pre'>v, rec</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Return simplified feature properties rather than full GeoJSON ...</div><div class='long'><p>Return simplified feature properties rather than full GeoJSON</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>v</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>rec</span> : Object<div class='sub-desc'></div></li></ul></div></div></div></div></div></div></div>","meta":{}});