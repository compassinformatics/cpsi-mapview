Ext.define('CpsiMapview.view.snappingExample.EdgeWindowViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.cmv_edgewindowviewmodel',
    mixins: ['CpsiMapview.form.ViewModelMixin'],
    data: {
        featureStoreName: 'geometry',
        hideSaveButton: true,
        hideDeleteButton: true
    },
    formulas: {
        valid: function (get) {
            get('timestamp');
            get('currentRecord.geometry'); // required so that if edges are added the form becomes valid

            const ctlr = this.getView().getController();
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
                const me = this;
                const source = resultLayer.getSource();

                source.on('localdrawend', function (event) {
                    const rec = me.get('currentRecord');
                    const result = event.result;
                    rec.set(result);
                });

                source.on('clear', function () {
                    const rec = me.get('currentRecord');
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
