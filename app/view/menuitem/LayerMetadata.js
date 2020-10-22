/**
 * MenuItem to show a metadata window for a layer
 *
 * @class CpsiMapview.view.menuitem.LayerMetadata
 */
Ext.define('CpsiMapview.view.menuitem.LayerMetadata', {
    extend: 'Ext.menu.Item',
    xtype: 'cmv_menuitem_layermetadata',
    requires: [
        'CpsiMapview.util.Layer'
    ],

    /**
     * The connected layer for this item.
     *
     * @cfg {ol.layer.Base}
     */
    layer: null,

    /**
     * Text shown in this MenuItem
     * @cfg {String}
     */
    text: 'Metadata',

    /**
     * @private
     */
    initComponent: function () {
        var me = this;

        me.handler = me.handlerFunc;

        var hasMetadata = false;
        if (me.layer) {
            hasMetadata = me.layer.get('hasMetadata');
        }

        me.callParent();
        me.setHidden(!hasMetadata);
    },

    /**
     * Executed when this menu item is clicked.
     * Opens a window with metadata for the connected layer.
     */
    handlerFunc: function () {
        var me = this;

        // retrive layername for different types of layers
        var layerName;
        var baseurl;
        if(me.layer.get('isWfs')){
            layerName = me.layer.get('featureType');
            baseurl = me.layer.get('url');
        }
        else if(me.layer.get('isWms')){
            layerName = me.layer.get('layers');
            baseurl = me.layer.get('url');
        }
        else if(me.layer.get('isVt')){
            layerName = me.layer.get('layerIdentificationName');
            baseurl = me.layer.get('baseurl');
        }
        else{
            // Currently only metadata from WMS and WFS can be received
            // because other layers do not come from MapServer
            // VectorTiles are an exception: the config does
            // not provide easy access to name and baseurl
            me.alertNoMetadata();
            return;
        }

        // build url to Metadata XML
        var requestUrl = baseurl + '&REQUEST=GetMetadata' + '&layer=' + layerName;

        Ext.Ajax.request({
            url: requestUrl,
            success: function (response) {

                var xmlText = response.responseText;
                var schemas =[
                    ISO19139_GMD_20060504,
                    ISO19139_GCO_20060504,
                    ISO19139_GTS_20060504,
                    ISO19139_GSS_20060504,
                    ISO19139_GSR_20060504,
                    GML_3_2_0,
                    XLink_1_0
                ];

                // convert XML to JSON
                var context = new Jsonix.Context(schemas);
                var unmarshaller = context.createUnmarshaller();

                // handle case if XML is not formated as expected
                try{
                    var jsonMetadata = unmarshaller.unmarshalString(xmlText);

                    // extract required properties
                    var relevantObj = jsonMetadata.value.identificationInfo[0].abstractMDIdentification.value;

                    var source = {};

                    // citation
                    var citationObj = relevantObj.citation.ciCitation.title.characterString;
                    if(citationObj){
                        var citation = citationObj.value;
                        source['title'] = citation;
                    }

                    // abstract
                    var abstractObj = relevantObj._abstract.characterString;
                    if(abstractObj){
                        var abstract = abstractObj.value;
                        source['abstract'] = abstract;
                    }
                    // keywords
                    var keywordString = '';
                    var keywordsObj = relevantObj.descriptiveKeywords;
                    if(keywordsObj){
                        var rawKeywords = keywordsObj[0].mdKeywords.keyword;
                        // convert keywords to comma separated string
                        Ext.each(rawKeywords, function(item){
                            var extractedKeyWord = item.characterString.value;
                            if(keywordString !== ''){
                                keywordString = keywordString + ', ';
                            }
                            keywordString = keywordString + extractedKeyWord;
                        }
                        );
                        source['keywords'] = keywordString;
                    }

                    // case no metadata could be extracted
                    if(Ext.Object.isEmpty(source)){
                        me.alertNoMetadata();
                    }
                    // metadata is fine and can be displayed
                    else{
                        var windowTitle = me.layer.get('name') + ' Metadata' ;

                        // check if window already exists
                        // identified by window title
                        var existingMetadataWindow = Ext.ComponentQuery.query('window[title="' + windowTitle + '"]');

                        var window;
                        if(existingMetadataWindow.length > 0){
                            // use existing window
                            window = existingMetadataWindow[0];
                        }
                        else {
                            window = Ext.create('CpsiMapview.view.window.MinimizableWindow', {
                                title: windowTitle,
                                width: 400,
                                layout: 'fit',
                                constrain: true,
                                items: [{
                                    xtype: 'propertygrid',
                                    source: source
                                }]
                            });
                        }
                        window.show();
                    }
                }
                catch(err) {
                    me.alertNoMetadata();
                }
            },
            failure: function() {
                me.alertNoMetadata();
            }
        });
    },

    /**
    * Notifies user that metadata is not availble
    */
    alertNoMetadata: function(){
        Ext.Msg.alert('Info', 'Metadata is not available.');
    }
});
