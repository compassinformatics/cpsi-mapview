describe('CpsiMapview.controller.button.SnappingMixin', function () {
    let inst;
    let mockMap;
    let mockView;
    let mockLayer;
    let mockSource;
    let mockSnapCollection;
    let addFeatureListeners;
    let removeFeatureListeners;
    let layerChangeListeners;

    beforeEach(function () {
        addFeatureListeners = [];
        removeFeatureListeners = [];
        layerChangeListeners = [];

        // Mock ol.Collection
        mockSnapCollection = {
            push: sinon.stub(),
            remove: sinon.stub(),
            extend: sinon.stub()
        };

        // Mock ol.interaction.Snap
        sinon.stub(ol.interaction, 'Snap').returns({ type: 'snap' });

        // Mock ol.Collection constructor
        sinon.stub(ol, 'Collection').returns(mockSnapCollection);

        // Mock ol.Observable.unByKey
        sinon.stub(ol.Observable, 'unByKey');

        // A factory for mock layer sources
        const makeMockSource = (features) => ({
            getFeatures: sinon.stub().returns(features || []),
            getFeaturesCollection: sinon.stub().returns({
                on: sinon.stub()
            }),
            hasFeature: sinon.stub().returns(false),
            on: sinon.stub().callsFake(function (event, handler) {
                const key = { event, handler };
                if (event === 'addfeature')
                    addFeatureListeners.push({ handler, key });
                if (event === 'removefeature')
                    removeFeatureListeners.push({ handler, key });
                return key;
            })
        });

        mockSource = makeMockSource([]);

        // Mock layer
        mockLayer = {
            getSource: sinon.stub().returns(mockSource),
            getVisible: sinon.stub().returns(true),
            on: sinon.stub().callsFake(function (event, handler) {
                const key = { event, handler };
                if (event === 'change:visible')
                    layerChangeListeners.push({ handler, key });
                return key;
            })
        };

        // Mock map
        mockMap = {
            addInteraction: sinon.stub(),
            removeInteraction: sinon.stub()
        };

        // Mock view
        mockView = {
            getSnappingLayerKeys: sinon.stub().returns(['testLayerKey']),
            getAllowSnapToHiddenFeatures: sinon.stub().returns(false)
        };

        // Stub BasiGX layer lookup
        sinon.stub(BasiGX.util.Layer, 'getLayersBy').returns([mockLayer]);

        inst = Ext.create('CpsiMapview.controller.button.SnappingMixin');
        inst.map = mockMap;
        inst.getView = sinon.stub().returns(mockView);
    });

    afterEach(function () {
        sinon.restore();
        inst = null;
    });

    it('is defined', function () {
        expect(CpsiMapview.controller.button.SnappingMixin).not.to.be(
            undefined
        );
    });

    it('can be instantiated', function () {
        expect(inst).to.be.a(CpsiMapview.controller.button.SnappingMixin);
    });

    describe('#setSnapInteraction', function () {
        it('creates an ol.interaction.Snap and adds it to the map', function () {
            inst.setSnapInteraction(null);
            expect(ol.interaction.Snap.calledOnce).to.be(true);
            expect(mockMap.addInteraction.calledOnce).to.be(true);
        });

        it('sets snapInteraction on the instance', function () {
            inst.setSnapInteraction(null);
            expect(inst.snapInteraction).not.to.be(null);
        });

        it('removes existing snapInteraction from the map before adding a new one', function () {
            const existingInteraction = { type: 'existing-snap' };
            inst.snapInteraction = existingInteraction;
            inst.setSnapInteraction(null);
            expect(
                mockMap.removeInteraction.calledWith(existingInteraction)
            ).to.be(true);
        });

        it('does not call removeInteraction if no previous snapInteraction exists', function () {
            inst.setSnapInteraction(null);
            expect(mockMap.removeInteraction.called).to.be(false);
        });

        it('looks up snapping layers by key from the view', function () {
            inst.setSnapInteraction(null);
            expect(mockView.getSnappingLayerKeys.calledOnce).to.be(true);
            expect(
                BasiGX.util.Layer.getLayersBy.calledWith(
                    'layerKey',
                    'testLayerKey'
                )
            ).to.be(true);
        });

        it('adds initial features from a visible layer to the snapCollection', function () {
            const mockFeature = { id: 'feat1' };
            mockSource.getFeatures.returns([mockFeature]);
            mockLayer.getVisible.returns(true);

            inst.setSnapInteraction(null);

            expect(mockSnapCollection.push.calledWith(mockFeature)).to.be(true);
        });

        it('does not add features from a hidden layer when allowSnapToHiddenFeatures is false', function () {
            const mockFeature = { id: 'feat1' };
            mockSource.getFeatures.returns([mockFeature]);
            mockLayer.getVisible.returns(false);
            mockView.getAllowSnapToHiddenFeatures.returns(false);

            inst.setSnapInteraction(null);

            expect(mockSnapCollection.push.called).to.be(false);
        });

        it('adds features from a hidden layer when allowSnapToHiddenFeatures is true', function () {
            const mockFeature = { id: 'feat1' };
            mockSource.getFeatures.returns([mockFeature]);
            mockLayer.getVisible.returns(false);
            mockView.getAllowSnapToHiddenFeatures.returns(true);

            inst.setSnapInteraction(null);

            expect(mockSnapCollection.push.calledWith(mockFeature)).to.be(true);
        });

        it('registers addfeature and removefeature listeners on each layer source', function () {
            inst.setSnapInteraction(null);
            expect(addFeatureListeners.length).to.be(1);
            expect(removeFeatureListeners.length).to.be(1);
        });

        it('stores listener keys in listenerKeys', function () {
            inst.setSnapInteraction(null);
            // at minimum addfeature and removefeature keys
            expect(inst.listenerKeys.length).to.be.greaterThan(0);
        });

        it('registers a change:visible listener when allowSnapToHiddenFeatures is false', function () {
            mockView.getAllowSnapToHiddenFeatures.returns(false);
            inst.setSnapInteraction(null);
            expect(layerChangeListeners.length).to.be(1);
        });

        it('does not register a change:visible listener when allowSnapToHiddenFeatures is true', function () {
            mockView.getAllowSnapToHiddenFeatures.returns(true);
            inst.setSnapInteraction(null);
            expect(layerChangeListeners.length).to.be(0);
        });

        it('calls unBindLayerListeners to clean up previous listeners before setting new ones', function () {
            sinon.spy(inst, 'unBindLayerListeners');
            inst.setSnapInteraction(null);
            expect(inst.unBindLayerListeners.calledOnce).to.be(true);
        });

        it('handles a drawLayer by listening to its features collection add/remove events', function () {
            const mockFcOn = sinon.stub();
            const mockDrawLayer = {
                getSource: sinon.stub().returns({
                    getFeaturesCollection: sinon
                        .stub()
                        .returns({ on: mockFcOn })
                })
            };

            inst.setSnapInteraction(mockDrawLayer);

            expect(mockFcOn.calledWith('add')).to.be(true);
            expect(mockFcOn.calledWith('remove')).to.be(true);
        });

        it('does not throw when drawLayer is null', function () {
            expect(function () {
                inst.setSnapInteraction(null);
            }).not.to.throwException();
        });

        // addfeature event handler behaviour
        it('adds a feature to snapCollection when addfeature fires on a visible layer', function () {
            mockLayer.getVisible.returns(true);
            inst.setSnapInteraction(null);

            const newFeature = { id: 'new' };
            addFeatureListeners[0].handler({ feature: newFeature });

            expect(mockSnapCollection.push.calledWith(newFeature)).to.be(true);
        });

        it('does not add a feature to snapCollection when addfeature fires on a hidden layer (allowSnapToHiddenFeatures false)', function () {
            mockLayer.getVisible.returns(false);
            mockView.getAllowSnapToHiddenFeatures.returns(false);
            inst.setSnapInteraction(null);

            // reset push call count after initial setup
            mockSnapCollection.push.resetHistory();

            const newFeature = { id: 'new' };
            addFeatureListeners[0].handler({ feature: newFeature });

            expect(mockSnapCollection.push.called).to.be(false);
        });

        // removefeature event handler behaviour
        it('removes a feature from snapCollection when removefeature fires and feature is not in other layers', function () {
            mockSource.hasFeature = sinon.stub().returns(false);
            inst.setSnapInteraction(null);

            const removedFeature = { id: 'removed' };
            removeFeatureListeners[0].handler({ feature: removedFeature });

            expect(mockSnapCollection.remove.calledWith(removedFeature)).to.be(
                true
            );
        });

        it('does not remove a feature from snapCollection when it still exists in another layer', function () {
            const secondSource = {
                getFeatures: sinon.stub().returns([]),
                hasFeature: sinon.stub().returns(true),
                on: sinon.stub().returns({})
            };
            const secondLayer = {
                getSource: sinon.stub().returns(secondSource),
                getVisible: sinon.stub().returns(true),
                on: sinon.stub().returns({})
            };

            // Return the correct layer per key lookup
            BasiGX.util.Layer.getLayersBy.callsFake(function (prop, key) {
                if (key === 'key1') return [mockLayer];
                if (key === 'key2') return [secondLayer];
                return [];
            });
            mockView.getSnappingLayerKeys.returns(['key1', 'key2']);
            mockSource.hasFeature = sinon.stub().returns(false);

            inst.setSnapInteraction(null);
            mockSnapCollection.remove.resetHistory();

            const removedFeature = { id: 'shared' };
            removeFeatureListeners[0].handler({ feature: removedFeature });

            expect(mockSnapCollection.remove.called).to.be(false);
        });

        // change:visible handler behaviour
        it('adds features to snapCollection when a layer becomes visible', function () {
            mockLayer.getVisible.returns(false);
            mockView.getAllowSnapToHiddenFeatures.returns(false);

            const feat = { id: 'f' };
            mockSource.getFeatures.returns([feat]);

            inst.setSnapInteraction(null);
            mockSnapCollection.push.resetHistory();

            // Simulate layer becoming visible
            mockLayer.getVisible.returns(true);
            layerChangeListeners[0].handler();

            expect(mockSnapCollection.push.calledWith(feat)).to.be(true);
        });

        it('removes features from snapCollection when a layer becomes hidden', function () {
            mockLayer.getVisible.returns(true);
            mockView.getAllowSnapToHiddenFeatures.returns(false);

            const feat = { id: 'f' };
            mockSource.getFeatures.returns([feat]);
            mockSource.hasFeature = sinon.stub().returns(false);

            inst.setSnapInteraction(null);

            // Simulate layer being hidden
            mockLayer.getVisible.returns(false);
            layerChangeListeners[0].handler();

            expect(mockSnapCollection.remove.calledWith(feat)).to.be(true);
        });

        it('does not fail when duplicate features are pushed to the snapCollection', function () {
            mockSnapCollection.push.throws(new Error('duplicate'));
            mockSource.getFeatures.returns([{ id: 'dup' }]);
            mockLayer.getVisible.returns(true);

            expect(function () {
                inst.setSnapInteraction(null);
            }).not.to.throwException();
        });
    });

    // -------------------------------------------------------------------------
    // unBindLayerListeners
    // -------------------------------------------------------------------------

    describe('#unBindLayerListeners', function () {
        it('calls ol.Observable.unByKey for each stored listener key', function () {
            const key1 = { id: 1 };
            const key2 = { id: 2 };
            inst.listenerKeys = [key1, key2];

            inst.unBindLayerListeners();

            expect(ol.Observable.unByKey.calledWith(key1)).to.be(true);
            expect(ol.Observable.unByKey.calledWith(key2)).to.be(true);
        });

        it('resets listenerKeys to an empty array after unbinding', function () {
            inst.listenerKeys = [{ id: 1 }];
            inst.unBindLayerListeners();
            expect(inst.listenerKeys.length).to.be(0);
        });

        it('does not throw when listenerKeys is empty', function () {
            inst.listenerKeys = [];
            expect(function () {
                inst.unBindLayerListeners();
            }).not.to.throwException();
        });

        it('unbinds previous listeners when setSnapInteraction is called a second time', function () {
            inst.setSnapInteraction(null);
            const firstKeys = inst.listenerKeys.slice();

            inst.setSnapInteraction(null);

            firstKeys.forEach(function (key) {
                expect(ol.Observable.unByKey.calledWith(key)).to.be(true);
            });
        });
    });
});
