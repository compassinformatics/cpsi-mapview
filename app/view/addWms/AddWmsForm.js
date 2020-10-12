Ext.define('CpsiMapview.view.addWms.AddWmsForm', {
    extend: 'BasiGX.view.form.AddWms',

    xtype: 'cmv_add_wms_form',

    requires: ['CpsiMapview.controller.addWms.AddWmsFormController'],

    viewModel: {
        data: {
            queryParamsFieldSetTitle: 'Request parameters',
            wmsUrlTextFieldLabel: 'WMS-URL',
            wmsVersionContainerFieldLabel: 'Version',
            availableLayesFieldSetTitle: 'Available layers',
            resetBtnText: 'Reset',
            requestLayersBtnText: 'Request available layers',
            checkAllLayersBtnText: 'Check all',
            uncheckAllLayersBtnText: 'Uncheck all',
            addCheckedLayersBtnText: 'Add chosen layer',
            errorIncompatibleWMS: 'The requested WMS is not compatible to the application',
            errorRequestFailed: 'The given URL could not be requested.',
            errorCouldntParseResponse: 'The received response could not be parsed successfully.',
            msgRequestTimedOut: 'The request was not answered in time and was aborted.',
            msgServiceException: 'An OGC ServiceException has occurred',
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
            documentation: '<h2>Add WMS</h2>• In this dialog you can add any desired map service to the map with the ' +
                'help of an WMS-URL.'
        }
    },

    controller: 'cmv_add_wms_form',

    listeners: {
        wmsadd: 'onWmsAdd'
    },

    layerGroupName: 'External Layers'
});
