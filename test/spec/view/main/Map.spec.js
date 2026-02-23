describe('CpsiMapview.view.main.Map', function () {
    before(function () {
        const app = Ext.getApplication
            ? Ext.getApplication()
            : Ext.app.Application.instance;
        app.getResourcePaths = function () {
            return new Ext.Promise(function (resolve) {
                resolve({
                    layerConfig: 'resources/data/layers/default.json',
                    treeConfig: 'resources/data/layers/tree.json'
                });
            });
        };
    });

    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.view.main.Map).not.to.be(undefined);
        });

        it('can be instantiated', function () {
            const inst = Ext.create('CpsiMapview.view.main.Map', {});
            expect(inst).to.be.a(CpsiMapview.view.main.Map);
        });
    });

    describe('interactivity', function () {
        it('changes cursor to pointer when hovering over a clickable feature', function () {
            const mapPanel = Ext.create('CpsiMapview.view.main.Map', {
                clickableLayerConfigs: {
                    EXAMPLE_VECTOR: {}
                }
            });

            const map = mapPanel.olMap;

            // mock the map and target element
            const mockTargetEl = {
                style: {
                    cursor: ''
                }
            };

            map.getTargetElement = function () {
                return mockTargetEl;
            };

            map.hasFeatureAtPixel = function () {
                return true;
            };

            const controller = mapPanel.getController();

            // simulate pointer move event
            controller.onPointerMove({ dragging: false, pixel: [100, 100] });
            expect(mockTargetEl.style.cursor).to.be('pointer');

            // simulate moving off the feature
            map.hasFeatureAtPixel = function () {
                return false;
            };
            controller.onPointerMove({ dragging: false, pixel: [200, 200] });
            expect(mockTargetEl.style.cursor).to.be('');
        });
    });
});
