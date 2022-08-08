Ext.define('CpsiMapview.view.addArcGISRest.AddArcGISRestForm', {
    extend: 'BasiGX.view.form.AddArcGISRest',

    xtype: 'cmv_add_arcgisrest_form',

    requires: ['CpsiMapview.controller.addArcGISRest.AddArcGISRestFormController'],

    viewModel: {
        data: {
            queryParamsFieldSetTitle: 'Request parameters',
            arcGISUrlTextFieldLabel: 'ArcGIS Service URL',
            availableLayersFieldSetTitle: 'Available layers',
            resetBtnText: 'Reset',
            requestLayersBtnText: 'Request available layers',
            checkAllLayersBtnText: 'Check all',
            uncheckAllLayersBtnText: 'Uncheck all',
            addCheckedLayersBtnText: 'Add chosen layers',
            errorRequestFailed: 'The given URL could not be requested.',
            msgRequestTimedOut: 'The request was not answered in time and was aborted.',
            msgCorsMisconfiguration: 'HTTP access control (CORS) on the target server is probably not ' +
                'configured correctly.',
            msgUnauthorized: 'The client is not authenticated against the target server.',
            msgForbidden: 'The client has no access to the requested resource.',
            msgFileNotFound: 'The requested resource does not exist.',
            msgTooManyRequests: 'The client sent to many requests.',
            msgServiceUnavailable: 'The server is currently not available (too many or request or maintenance mode).',
            msgGatewayTimeOut: 'The server acted as a gateway and the original target did not respond in time',
            msgClientError: 'An unspecified client error has occurred.',
            msgServerError: 'An unspecified server error has occurred.',
            msgInvalidUrl: 'The provided URL is not a valid ArcGIS REST URL',
            documentation: '<h2>Add ArcGIS REST layer</h2>• In this dialog you can add any desired map service to the map with the ' +
                'help of an ArcGIS REST URL.'
        }
    },

    controller: 'cmv_add_arcgisrest_form',

    listeners: {
        arcgisrestadd: 'onArcGISRestAdd'
    },

    bodyPadding: '5px',

    layerGroupName: 'External Layers'
});
