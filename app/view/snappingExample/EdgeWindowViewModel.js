Ext.define('CpsiMapview.view.snappingExample.EdgeWindowViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.cmv_edgewindowviewmodel',
    mixins: [
        'CpsiMapview.form.ViewModelMixin'
    ],
    data: {
        featureStoreName: 'geometry',
        hideSaveButton: true,
        hideDeleteButton: true
    },
    formulas: {

        valid: function (get) {
            get('timestamp');
            get('currentRecord.geometry'); // required so that if edges are added the form becomes valid

            var ctlr = this.getView().getController();
            if (ctlr) {
                return ctlr.checkValid(get('currentRecord'));
            } else {
                return false;
            }
        },

        /**
        * Executed once result layer is available.
        * Creates a listener if the point geometry is changed.
        */
        onResultLayer: {
            bind: '{resultLayer}',

            get: function (resultLayer) {
                var me = this;
                var source = resultLayer.getSource();

                source.on('localdrawend', function (event) {
                    var rec = me.get('currentRecord');
                    var result = event.result;
                    rec.set(result);
                });

                source.on('clear', function () {
                    var rec = me.get('currentRecord');
                    rec.set({
                        startCoord: null,
                        endCoord: null,
                        startNodeId: null,
                        endNodeId: null,
                        startEdgeId: null,
                        endEdgeId: null
                    });
                });
            }
        }
    }
});
