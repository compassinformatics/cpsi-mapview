Ext.data.JsonP.CpsiMapview_util_ApplicationMixin({"tagname":"class","name":"CpsiMapview.util.ApplicationMixin","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"ApplicationMixin.js","href":"ApplicationMixin.html#CpsiMapview-util-ApplicationMixin"}],"aliases":{},"alternateClassNames":[],"extends":"Ext.Mixin","mixins":[],"requires":["CpsiMapview.view.form.Login","Ext.window.MessageBox"],"uses":[],"members":[{"name":"applicationLoaded","tagname":"property","owner":"CpsiMapview.util.ApplicationMixin","id":"property-applicationLoaded","meta":{}},{"name":"authenticationUrl","tagname":"property","owner":"CpsiMapview.util.ApplicationMixin","id":"property-authenticationUrl","meta":{}},{"name":"errorCode","tagname":"property","owner":"CpsiMapview.util.ApplicationMixin","id":"property-errorCode","meta":{"private":true}},{"name":"excludedUrls","tagname":"property","owner":"CpsiMapview.util.ApplicationMixin","id":"property-excludedUrls","meta":{}},{"name":"loginWindow","tagname":"property","owner":"CpsiMapview.util.ApplicationMixin","id":"property-loginWindow","meta":{}},{"name":"lookupStores","tagname":"property","owner":"CpsiMapview.util.ApplicationMixin","id":"property-lookupStores","meta":{}},{"name":"mainViewXType","tagname":"property","owner":"CpsiMapview.util.ApplicationMixin","id":"property-mainViewXType","meta":{}},{"name":"minimumRequiredRole","tagname":"property","owner":"CpsiMapview.util.ApplicationMixin","id":"property-minimumRequiredRole","meta":{}},{"name":"mixinConfig","tagname":"property","owner":"CpsiMapview.util.ApplicationMixin","id":"property-mixinConfig","meta":{"private":true}},{"name":"platformConfig","tagname":"property","owner":"CpsiMapview.util.ApplicationMixin","id":"property-platformConfig","meta":{"private":true}},{"name":"quickTips","tagname":"property","owner":"CpsiMapview.util.ApplicationMixin","id":"property-quickTips","meta":{"private":true}},{"name":"requireLogin","tagname":"property","owner":"CpsiMapview.util.ApplicationMixin","id":"property-requireLogin","meta":{}},{"name":"rootHelpUrl","tagname":"property","owner":"CpsiMapview.util.ApplicationMixin","id":"property-rootHelpUrl","meta":{}},{"name":"serviceUrls","tagname":"property","owner":"CpsiMapview.util.ApplicationMixin","id":"property-serviceUrls","meta":{}},{"name":"storeCounter","tagname":"property","owner":"CpsiMapview.util.ApplicationMixin","id":"property-storeCounter","meta":{}},{"name":"tokenName","tagname":"property","owner":"CpsiMapview.util.ApplicationMixin","id":"property-tokenName","meta":{}},{"name":"tokenValidationUrl","tagname":"property","owner":"CpsiMapview.util.ApplicationMixin","id":"property-tokenValidationUrl","meta":{}},{"name":"beforeInit","tagname":"method","owner":"CpsiMapview.util.ApplicationMixin","id":"method-beforeInit","meta":{}},{"name":"doLogin","tagname":"method","owner":"CpsiMapview.util.ApplicationMixin","id":"method-doLogin","meta":{}},{"name":"getResourcePaths","tagname":"method","owner":"CpsiMapview.util.ApplicationMixin","id":"method-getResourcePaths","meta":{"private":true}},{"name":"getSiteSettings","tagname":"method","owner":"CpsiMapview.util.ApplicationMixin","id":"method-getSiteSettings","meta":{}},{"name":"getUrlParameter","tagname":"method","owner":"CpsiMapview.util.ApplicationMixin","id":"method-getUrlParameter","meta":{}},{"name":"loadAllStores","tagname":"method","owner":"CpsiMapview.util.ApplicationMixin","id":"method-loadAllStores","meta":{}},{"name":"loadApplication","tagname":"method","owner":"CpsiMapview.util.ApplicationMixin","id":"method-loadApplication","meta":{}},{"name":"onAjaxBeforeRequest","tagname":"method","owner":"CpsiMapview.util.ApplicationMixin","id":"method-onAjaxBeforeRequest","meta":{"private":true}},{"name":"onAjaxRequestComplete","tagname":"method","owner":"CpsiMapview.util.ApplicationMixin","id":"method-onAjaxRequestComplete","meta":{"private":true}},{"name":"onAjaxRequestException","tagname":"method","owner":"CpsiMapview.util.ApplicationMixin","id":"method-onAjaxRequestException","meta":{"private":true}},{"name":"onApplicationCreated","tagname":"method","owner":"CpsiMapview.util.ApplicationMixin","id":"method-onApplicationCreated","meta":{"private":true}},{"name":"onApplicationUpdated","tagname":"method","owner":"CpsiMapview.util.ApplicationMixin","id":"method-onApplicationUpdated","meta":{}},{"name":"onLogin","tagname":"method","owner":"CpsiMapview.util.ApplicationMixin","id":"method-onLogin","meta":{}},{"name":"onMapToolsToggle","tagname":"method","owner":"CpsiMapview.util.ApplicationMixin","id":"method-onMapToolsToggle","meta":{}},{"name":"setupRequestHooks","tagname":"method","owner":"CpsiMapview.util.ApplicationMixin","id":"method-setupRequestHooks","meta":{}},{"name":"storeLoaded","tagname":"method","owner":"CpsiMapview.util.ApplicationMixin","id":"method-storeLoaded","meta":{}}],"code_type":"ext_define","id":"class-CpsiMapview.util.ApplicationMixin","component":false,"superclasses":["Ext.Mixin"],"subclasses":[],"mixedInto":["CpsiMapview.Application"],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.Mixin<div class='subclass '><strong>CpsiMapview.util.ApplicationMixin</strong></div></div><h4>Requires</h4><div class='dependency'>CpsiMapview.view.form.Login</div><div class='dependency'>Ext.window.MessageBox</div><h4>Mixed into</h4><div class='dependency'><a href='#!/api/CpsiMapview.Application' rel='CpsiMapview.Application' class='docClass'>CpsiMapview.Application</a></div><h4>Files</h4><div class='dependency'><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin' target='_blank'>ApplicationMixin.js</a></div></pre><div class='doc-contents'><p>A mapview Application mixin containing generic functions that can be reused\nbetween applications</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-applicationLoaded' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-property-applicationLoaded' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-property-applicationLoaded' class='name expandable'>applicationLoaded</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>A flag to indicate if the viewport and stores have been loaded\nfor the application ...</div><div class='long'><p>A flag to indicate if the viewport and stores have been loaded\nfor the application</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='property-authenticationUrl' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-property-authenticationUrl' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-property-authenticationUrl' class='name expandable'>authenticationUrl</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>URL for logging into the application ...</div><div class='long'><p>URL for logging into the application</p>\n<p>Defaults to: <code>&#39;/WebServices/authorization/authenticate&#39;</code></p></div></div></div><div id='property-errorCode' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-property-errorCode' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-property-errorCode' class='name expandable'>errorCode</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>{None: 0, AccountLockedOut: 1, AccountDoesNotExist: 2, UserTokenExpired: 3, CookieHeaderMissing: 4, NoPermission: 5, NoTokenProvided: 6, GeneralServerError: 500, FileNotFound: 404}</code></p></div></div></div><div id='property-excludedUrls' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-property-excludedUrls' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-property-excludedUrls' class='name expandable'>excludedUrls</a> : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>URLs to ignore for errors ...</div><div class='long'><p>URLs to ignore for errors</p>\n<p>Defaults to: <code>[]</code></p></div></div></div><div id='property-loginWindow' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-property-loginWindow' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-property-loginWindow' class='name expandable'>loginWindow</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Property to store a reference to the login window</p>\n</div><div class='long'><p>Property to store a reference to the login window</p>\n</div></div></div><div id='property-lookupStores' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-property-lookupStores' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-property-lookupStores' class='name expandable'>lookupStores</a> : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>Custom property to list all stores that should be loaded as soon as a user logs in ...</div><div class='long'><p>Custom property to list all stores that should be loaded as soon as a user logs in</p>\n<p>Defaults to: <code>[]</code></p></div></div></div><div id='property-mainViewXType' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-property-mainViewXType' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-property-mainViewXType' class='name expandable'>mainViewXType</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>The xtype of the main application viewport to be loaded\nonce a user is logged in</p>\n</div><div class='long'><p>The xtype of the main application viewport to be loaded\nonce a user is logged in</p>\n</div></div></div><div id='property-minimumRequiredRole' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-property-minimumRequiredRole' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-property-minimumRequiredRole' class='name expandable'>minimumRequiredRole</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Set the minimum role name (a string) that is required to access the browser system,\nin the event that users are share...</div><div class='long'><p>Set the minimum role name (a string) that is required to access the browser system,\nin the event that users are shared between browser and other applications</p>\n</div></div></div><div id='property-mixinConfig' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-property-mixinConfig' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-property-mixinConfig' class='name expandable'>mixinConfig</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>{after: {constructor: &#39;onApplicationCreated&#39;, onAppUpdate: &#39;onApplicationUpdated&#39;}, before: {init: &#39;beforeInit&#39;}}</code></p></div></div></div><div id='property-platformConfig' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-property-platformConfig' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-property-platformConfig' class='name expandable'>platformConfig</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>when the platform is matched any properties are placed on the class ...</div><div class='long'><p>when the platform is matched any properties are placed on the class</p>\n<p>Defaults to: <code>{desktop: {quickTips: true}}</code></p></div></div></div><div id='property-quickTips' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-property-quickTips' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-property-quickTips' class='name expandable'>quickTips</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>see https://docs.sencha.com/extjs/6.7.0/classic/Ext.app.Application.html#cfg-quickTips ...</div><div class='long'><p>see https://docs.sencha.com/extjs/6.7.0/classic/Ext.app.Application.html#cfg-quickTips</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='property-requireLogin' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-property-requireLogin' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-property-requireLogin' class='name expandable'>requireLogin</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Does the application require a login window for access ...</div><div class='long'><p>Does the application require a login window for access</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='property-rootHelpUrl' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-property-rootHelpUrl' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-property-rootHelpUrl' class='name expandable'>rootHelpUrl</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>URL to use as the root for any window helpUrl ...</div><div class='long'><p>URL to use as the root for any window helpUrl</p>\n<p>Defaults to: <code>&#39;&#39;</code></p></div></div></div><div id='property-serviceUrls' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-property-serviceUrls' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-property-serviceUrls' class='name expandable'>serviceUrls</a> : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>URLs to monitor for service errors ...</div><div class='long'><p>URLs to monitor for service errors</p>\n<p>Defaults to: <code>[]</code></p></div></div></div><div id='property-storeCounter' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-property-storeCounter' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-property-storeCounter' class='name expandable'>storeCounter</a> : Number<span class=\"signature\"></span></div><div class='description'><div class='short'>A counter property to keep track of how many stores need to\nbe loaded before the application can become active ...</div><div class='long'><p>A counter property to keep track of how many stores need to\nbe loaded before the application can become active</p>\n<p>Defaults to: <code>0</code></p></div></div></div><div id='property-tokenName' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-property-tokenName' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-property-tokenName' class='name expandable'>tokenName</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The token name within a cookie that stores a login token ...</div><div class='long'><p>The token name within a cookie that stores a login token</p>\n<p>Defaults to: <code>&#39;cookietoken&#39;</code></p></div></div></div><div id='property-tokenValidationUrl' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-property-tokenValidationUrl' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-property-tokenValidationUrl' class='name expandable'>tokenValidationUrl</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>URL for validating application tokens ...</div><div class='long'><p>URL for validating application tokens</p>\n<p>Defaults to: <code>&#39;/WebServices/authorization/validateToken&#39;</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-beforeInit' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-method-beforeInit' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-method-beforeInit' class='name expandable'>beforeInit</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Common setup code prior to initializing the application ...</div><div class='long'><p>Common setup code prior to initializing the application</p>\n</div></div></div><div id='method-doLogin' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-method-doLogin' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-method-doLogin' class='name expandable'>doLogin</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Open the login form when the application is opened. ...</div><div class='long'><p>Open the login form when the application is opened. Attempt\nto login automatically if the user already has a cookie and token.\nIf the form has already been created then simply show it.</p>\n</div></div></div><div id='method-getResourcePaths' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-method-getResourcePaths' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-method-getResourcePaths' class='name expandable'>getResourcePaths</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-getSiteSettings' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-method-getSiteSettings' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-method-getSiteSettings' class='name expandable'>getSiteSettings</a>( <span class='pre'>storeKey, siteKey</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>When multiple sites are supported, lookup\napplication settings from a store using the\nsupplied key ...</div><div class='long'><p>When multiple sites are supported, lookup\napplication settings from a store using the\nsupplied key</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>storeKey</span> : any<div class='sub-desc'>\n</div></li><li><span class='pre'>siteKey</span> : any<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getUrlParameter' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-method-getUrlParameter' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-method-getUrlParameter' class='name expandable'>getUrlParameter</a>( <span class='pre'>regex</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Get a value from the hostname in the browser\nusing the supplied regex ...</div><div class='long'><p>Get a value from the hostname in the browser\nusing the supplied regex</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>regex</span> : any<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-loadAllStores' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-method-loadAllStores' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-method-loadAllStores' class='name expandable'>loadAllStores</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Loop through all remote stores in the custom lookupStores property\nand add a listener to keep track of then they are ...</div><div class='long'><p>Loop through all remote stores in the custom lookupStores property\nand add a listener to keep track of then they are loaded</p>\n</div></div></div><div id='method-loadApplication' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-method-loadApplication' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-method-loadApplication' class='name expandable'>loadApplication</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Add the main view to the viewport and load all the application stores\nWe don't want to show the viewport and load sto...</div><div class='long'><p>Add the main view to the viewport and load all the application stores\nWe don't want to show the viewport and load stores until the user is logged in\nso we use a similar approach to that described in the Sencha sample\nlogin app at https://docs.sencha.com/extjs/7.2.0/guides/tutorials/login_app/login_app.html</p>\n</div></div></div><div id='method-onAjaxBeforeRequest' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-method-onAjaxBeforeRequest' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-method-onAjaxBeforeRequest' class='name expandable'>onAjaxBeforeRequest</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-onAjaxRequestComplete' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-method-onAjaxRequestComplete' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-method-onAjaxRequestComplete' class='name expandable'>onAjaxRequestComplete</a>( <span class='pre'>connection, response</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>connection</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>response</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-onAjaxRequestException' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-method-onAjaxRequestException' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-method-onAjaxRequestException' class='name expandable'>onAjaxRequestException</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-onApplicationCreated' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-method-onApplicationCreated' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-method-onApplicationCreated' class='name expandable'>onApplicationCreated</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-onApplicationUpdated' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-method-onApplicationUpdated' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-method-onApplicationUpdated' class='name expandable'>onApplicationUpdated</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Ask the use if they wish to refresh the browser following an application update ...</div><div class='long'><p>Ask the use if they wish to refresh the browser following an application update</p>\n</div></div></div><div id='method-onLogin' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-method-onLogin' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-method-onLogin' class='name expandable'>onLogin</a>( <span class='pre'>loginData</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fire the global login event when the application is loaded ...</div><div class='long'><p>Fire the global login event when the application is loaded</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>loginData</span> : any<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-onMapToolsToggle' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-method-onMapToolsToggle' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-method-onMapToolsToggle' class='name expandable'>onMapToolsToggle</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Whenever any tools that are part of the 'map' toggleGroup are toggled\nwe check to see if any tools are still active. ...</div><div class='long'><p>Whenever any tools that are part of the 'map' toggleGroup are toggled\nwe check to see if any tools are still active.\nAs the 'pan' tool is simply a button with no associated tool we can exclude this\nfrom the search\nThe defaultClickEnabled value is then used to check if the\ndefault <a href=\"#!/api/CpsiMapview.plugin.FeatureInfoWindow\" rel=\"CpsiMapview.plugin.FeatureInfoWindow\" class=\"docClass\">CpsiMapview.plugin.FeatureInfoWindow</a> tool should be active</p>\n</div></div></div><div id='method-setupRequestHooks' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-method-setupRequestHooks' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-method-setupRequestHooks' class='name expandable'>setupRequestHooks</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Add hooks for all AJAX request to handle errors and logins ...</div><div class='long'><p>Add hooks for all AJAX request to handle errors and logins</p>\n</div></div></div><div id='method-storeLoaded' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CpsiMapview.util.ApplicationMixin'>CpsiMapview.util.ApplicationMixin</span><br/><a href='source/ApplicationMixin.html#CpsiMapview-util-ApplicationMixin-method-storeLoaded' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CpsiMapview.util.ApplicationMixin-method-storeLoaded' class='name expandable'>storeLoaded</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Decrease the storeCounter property and\nif all stores are loaded then unmask the application ...</div><div class='long'><p>Decrease the storeCounter property and\nif all stores are loaded then unmask the application</p>\n</div></div></div></div></div></div></div>","meta":{}});