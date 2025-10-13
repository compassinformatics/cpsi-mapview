/**
 * This class is the controller for the SplitByClick button.
 */
Ext.define('CpsiMapview.controller.button.SplitByClickButtonController', {
    extend: 'Ext.app.ViewController',
    requires: [
        'BasiGX.util.Map',
        'GeoExt.component.FeatureRenderer',
        'GeoExt.data.store.Features'
    ],

    alias: 'controller.cmv_split_by_click_button',

    /**
     * The OpenLayers map. If not given, will be auto-detected
     */
    map: null,

    /**
     * The BasiGX mapComponent. If not given, will be auto-detected
     */
    mapComponent: null,

    /**
     * Temporary vector layer used to display the response split features
     */
    resultLayer: null,

    constructor: function () {
        const me = this;
        me.splitOnClickedPosition = me.splitOnClickedPosition.bind(me);

        me.callParent(arguments);
    },

    /**
     * Set the layer used to store features returned by the split service
     * @param {ol.Layer} layer
     */
    setResultLayer: function (layer) {
        const me = this;

        if (!me.map) {
            return;
        }

        if (me.resultLayer) {
            me.map.removeLayer(me.resultLayer);
        }

        me.resultLayer = layer;
    },

    /**
     * Main handler which activates or deactivates the click listener for the
     * map.
     *
     * @param {Ext.button.Button} btn The button that has been pressed
     * @param {boolean} pressed The toggle state of the button
     */
    onToggle: function (btn, pressed) {
        const me = this;
        const view = me.getView();

        // guess the map if not given
        if (!me.map) {
            me.map = BasiGX.util.Map.getMapComponent()
                ? BasiGX.util.Map.getMapComponent().map
                : new ol.Map();
        }

        // create a result layer unless one has already been set
        if (!me.resultLayer) {
            me.resultLayer = view.resultLayer;
        }

        if (pressed) {
            me.map.on('click', me.splitOnClickedPosition);
        } else {
            me.map.un('click', me.splitOnClickedPosition);
        }
    },

    /**
     * Asynchronously request and proceed split features depending on clicked
     * position.
     *
     * @param {Event} evt OpenLayers click event
     * @returns {Ext.Promise<any|undefined>}
     */
    splitOnClickedPosition: function (evt) {
        const me = this;
        const map = me.map;
        const proj = map.getView().getProjection().getCode();
        const coordinates = evt.coordinate;
        const point = new ol.Feature(new ol.geom.Point(coordinates));
        const extent = point.getGeometry().getExtent();
        const associatedWin = this.getView().up('window');
        const associatedVm = associatedWin.getViewModel();
        const parentId = associatedVm.get('currentRecord.publicPrivateSplitId');
        const buffered = ol.extent.buffer(
            extent,
            me.getView().getPointExtentBuffer()
        );
        // transform to ITM since this projection is expected by backend.
        const bufferedITM = ol.proj.transformExtent(
            buffered,
            proj,
            'EPSG:2157'
        );
        const bboxSearchParam =
            '&bbox=' + encodeURIComponent(bufferedITM.join(','));
        let idParam = 'publicPrivateSplitId=';

        if (isNaN(parentId)) {
            // we're going to create a new split
            idParam += '0';
        } else {
            // we're going to edit the existing one
            idParam += parentId;
        }
        const searchParams = idParam + bboxSearchParam;

        return me
            .doAjaxRequest(searchParams)
            .then(me.parseSplitResponse.bind(me))
            .then(me.handleFinalResult.bind(me));
    },

    /**
     * Parses the split result to OpenLayers features
     *
     * @param {XMLHttpRequest} response
     * @returns {ol.Feature[]}
     */
    parseSplitResponse: function (response) {
        if (response) {
            let json;

            if (!Ext.isEmpty(response.responseText)) {
                try {
                    json = Ext.decode(response.responseText);
                } catch (e) {
                    BasiGX.error(
                        'Could not parse the response: ' + response.responseText
                    );
                    Ext.log.error(e);
                    return;
                }

                if (json.success && json.data) {
                    const existingPpSplitId =
                        json.data.existingPublicPrivateSplitId;
                    if (existingPpSplitId !== null) {
                        this.handleExistingSplit(existingPpSplitId);
                    } else {
                        const splitEdgeFeats = json.data.splitEdgeFeatures;
                        if (
                            splitEdgeFeats.features &&
                            splitEdgeFeats.features.length === 2
                        ) {
                            const format = new ol.format.GeoJSON();
                            return format.readFeaturesFromObject(
                                splitEdgeFeats
                            );
                        }
                    }
                } else {
                    BasiGX.error(
                        'Could not perform the split: ' +
                            (json.message ? json.message : JSON.stringify(json))
                    );
                }
            } else {
                BasiGX.error(
                    'Could not perform the split: ' +
                        (json.message ? json.message : JSON.stringify(json))
                );
            }
        } else {
            BasiGX.error('Response was empty');
        }
    },

    /**
     * Issues an Ext.Ajax.request against the configured endpoint with
     * the given params.
     *
     * @param {string} searchParams The serarchParams which will be
     *   appended to the request url
     * @returns {Ext.request.Base}
     */
    doAjaxRequest: function (searchParams) {
        const me = this;
        const mapComponent =
            me.mapComponent || BasiGX.util.Map.getMapComponent();
        const view = me.getView();
        let url = view.getApiUrl();

        if (!url) {
            Ext.log.warn('No API URL passed - split is not possible.');
            return;
        }

        if (searchParams) {
            url = Ext.urlAppend(url, searchParams);
        }

        mapComponent.setLoading(true);

        return new Ext.Promise(function (resolve) {
            Ext.Ajax.request({
                url: url,
                method: 'GET',
                success: function (response) {
                    mapComponent.setLoading(false);
                    resolve(response);
                },
                failure: function (response) {
                    mapComponent.setLoading(false);

                    if (response.aborted !== true) {
                        let errorMessage =
                            'Error while requesting the API endpoint';

                        if (
                            response.responseText &&
                            response.responseText.message
                        ) {
                            errorMessage +=
                                ': ' + response.responseText.message;
                        }

                        BasiGX.error(errorMessage);
                    }
                }
            });
        });
    },

    /**
     * Show confirm dialog to decide, whether the found existing split should be
     * opened for edit.
     * @param {number} splitId
     */
    handleExistingSplit: function (splitId) {
        const msg =
            'This edge has already been split. Open existing split record?';
        const me = this;

        BasiGX.confirm(msg, {
            title: 'Open Existing Split?',
            fn: function (buttonId) {
                if (buttonId === 'yes') {
                    const win = me.getView().up('window');
                    win.fireEvent('splitedgesupdate', splitId);
                }
            }
        });
    },

    /**
     * Handles the final result from endopoint. Refreshes the result layer with
     * retrieved split features.
     *
     * @param {undefined|ol.Feature[]} features The features returned from the API.
     */
    handleFinalResult: function (features) {
        if (features) {
            const me = this;
            const resultSource = me.resultLayer.getSource();
            resultSource.clear();
            resultSource.addFeatures(features);
        }
    },

    /**
     * Remove the result layer when this component gets destroyed.
     */
    onBeforeDestroy: function () {
        const me = this;
        const btn = me.getView();

        // detoggle button
        me.onToggle(btn, false);

        if (me.resultLayer) {
            me.map.removeLayer(me.resultLayer);
        }
    }
});
