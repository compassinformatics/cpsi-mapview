describe('CpsiMapview.factory.Layer', function () {

    Ext.Loader.syncRequire(['CpsiMapview.factory.Layer']);

    var layerFactory = CpsiMapview.factory.Layer;

    describe('buildRequiredPropertyNames', function () {

        it('should merge and clean property names in both arguments into a unique array', function () {
            var currentPropertyNames = ['Prop1', 'Prop2', 'Prop3', ''];
            var tooltipConfig = [{
                alias: 'Name',
                property: 'Prop1'
            }, {
                alias: 'Name',
                property: 'Prop4'
            }];
            var propertyNames = layerFactory.buildRequiredPropertyNames(currentPropertyNames, tooltipConfig);
            expect(propertyNames).to.eql(['Prop1', 'Prop2', 'Prop3', 'Prop4']);

        });

    });

    describe('getPropertyNamesInSLD', function () {

        it('should extract PropertName values from an SLD', function (done) {
            Ext.Ajax.request({
                url: '/resources/style/style1.xml',
                success: function (response) {
                    var propertyNames = layerFactory.getPropertyNamesInSLD(response.responseXML);
                    expect(propertyNames).to.eql(['EdgeId', 'FID']);
                    done();
                }
            });
        });

    });

    describe('createLayers', function () {

        it('createVectorTilesWmsLayer', function () {

            var layerConf = {
                "layerType": "vtwms",
                "format": "MVT",
                "layerKey": "WATERWAYS_VTWMS",
                "url": "./mapserver/?map=mymap",
                "hasMetadata": true,
                "layerIdentificationName": "test",
                "openLayers": {
                    "visibility": false
                },
                "sldUrl": "les&LAYERS=waterways",
                "tooltipsConfig": [
                    {
                        "alias": "Id",
                        "property": "osm_id"
                    }
                ]
            };

            var layer = layerFactory.createVectorTilesWmsLayer(layerConf);
            expect(layer).to.be.a(ol.layer.VectorTile);

        });


        it('createWfsLayerWithFilters', function () {

            var layerConf = {
                "layerKey": "TEST_WFS",
                "layerType": "wfs",
                "idProperty": "ObjectId",
                "noCluster": true,
                "hasMetadata": true,
                "featureType": "Test",
                "styles": [
                    {
                        "name": "Test",
                        "labelRule": "labels",
                        "title": "Test Layer"
                    }
                ],
                "openLayers": {
                    "visibility": false,
                    "opacity": 0.9,
                    "projection": "EPSG:3857",
                    "maxScale": 100000
                },
                "filters": [
                    {
                        "property": "IsActive",
                        "value": "1",
                        "operator": "="
                    }
                ],
                "serverOptions": {
                    "propertyname": "ObjectId"
                },
                "tooltipsConfig": [
                    {
                        "alias": "ObjectId",
                        "property": "ObjectId"
                    }
                ]
            };

            var layer = layerFactory.createWfs(layerConf);
            expect(layer).to.be.a(ol.layer.Vector);

            var filters = layer.getSource().get('additionalFilters');
            expect(filters.length).to.be(1);
            expect(filters[0].getOperator()).to.be('=');
            expect(filters[0].getProperty()).to.be('IsActive');
            expect(filters[0].getValue()).to.be('1');
        });

    });

    describe('buildStyleConfigs', function () {

        it('can create style configs from sldUrl', function () {

            var layerConf = {
                sldUrl: 'my/test/path/style.xml'
            };

            var styleConfigs = layerFactory.createStyleConfigs(layerConf);
            expect(styleConfigs.length).to.be(1);
            expect(styleConfigs[0].sldUrl).to.be('my/test/path/style.xml');
            expect(styleConfigs[0].title).to.be('Default');
            expect(styleConfigs[0].name).to.be('Default');
            expect(styleConfigs[0].labelRule).to.be(undefined);
        });

        it('can create style configs from array', function () {

            var layerConf = {
                "styles": [
                    {
                        "name": "Gas Stations",
                        "sldUrl": "resources/data/styling/Test_Gas.xml",
                        "title": "Gas Style",
                        "labelRule": "Labels"
                    },
                    {
                        "name": "Gas Stations2",
                        "sldUrl": "resources/data/styling/Test_Alternative_Gas_Style.xml",
                        "title": "Another Style",
                        "labelRule": "labels"
                    }
                ]
            };

            var styleConfigs = layerFactory.createStyleConfigs(layerConf);
            expect(styleConfigs.length).to.be(2);
            expect(styleConfigs[0].name).to.be('Gas Stations');
            expect(styleConfigs[0].sldUrl).to.be('resources/data/styling/Test_Gas.xml');
            expect(styleConfigs[0].title).to.be('Gas Style');
            expect(styleConfigs[0].labelRule).to.be('Labels');
        });

        it('can create style configs using GetStyles', function () {

            var layerConf = {
                "url": "/mapserver/?",
                "featureType": "Boreholes",
                "styles": [
                    {
                        "name": "Type",
                        "labelRule": "Label"
                    },
                    {
                        "name": "Depth",
                        "labelRule": "Label",
                        "title": "Depth"
                    },
                    {
                        "name": "Unthemed",
                        "labelRule": "Label"
                    }
                ],
            };

            var styleConfigs = layerFactory.createStyleConfigs(layerConf);
            expect(styleConfigs.length).to.be(3);
            expect(styleConfigs[2].name).to.be('Unthemed');
            expect(styleConfigs[2].sldUrl).to.be('/mapserver/?version=1.3.0&request=GetStyles&service=WMS&layers=Boreholes');
            expect(styleConfigs[2].title).to.be('Unthemed');
            expect(styleConfigs[2].labelRule).to.be('Label');
        });

        it('can create style configs using GetStyles and an array of names', function () {

            var layerConf = {
                "url": "/mapserver/?",
                "featureType": "Boreholes",
                "styles": [
                    "Type",
                    "Depth",
                    "Unthemed"
                ]
            };

            var styleConfigs = layerFactory.createStyleConfigs(layerConf);
            expect(styleConfigs.length).to.be(3);
            expect(styleConfigs[2].name).to.be('Unthemed');
            expect(styleConfigs[2].sldUrl).to.be('/mapserver/?version=1.3.0&request=GetStyles&service=WMS&layers=Boreholes');
            expect(styleConfigs[2].title).to.be('Unthemed');
            expect(styleConfigs[2].labelRule).to.be('');
        });

        it('can create style configs using GetStyles and an array of strings and objects', function () {

            var layerConf = {
                "url": "/mapserver/?",
                "featureType": "Boreholes",
                "styles": [
                    {
                        "name": "Type",
                        "title": "Borehole Type"
                    },
                    "Depth",
                    {
                        "name": "Unthemed",
                        "title": "Unthemed"
                    }
                ]
            };

            var styleConfigs = layerFactory.createStyleConfigs(layerConf);
            expect(styleConfigs.length).to.be(3);
            expect(styleConfigs[1].name).to.be('Depth');
            expect(styleConfigs[1].sldUrl).to.be('/mapserver/?version=1.3.0&request=GetStyles&service=WMS&layers=Boreholes');
            expect(styleConfigs[1].title).to.be('Depth');
            expect(styleConfigs[1].labelRule).to.be('');
        });

    });

    describe('removeUnusedUserStyleNodes', function () {

        it('all styles returned when selected and labels are active', function (done) {

            var style = {
                name: 'Gas Stations',
                labelRule: 'Labels'
            };

            var labelsActive = true;

            Ext.Ajax.request({
                url: '/resources/style/Test_Gas.xml',
                success: function (response) {
                    var sldXmlDoc = response.responseXML;

                    var origUserStyleCount = Ext.DomQuery.select('UserStyle', sldXmlDoc).length;
                    var updatedXmlDoc = layerFactory.removeUnusedUserStyleNodes(sldXmlDoc, style, labelsActive);
                    var newStyleCount = Ext.DomQuery.select('UserStyle', updatedXmlDoc).length;
                    expect(origUserStyleCount).to.be(newStyleCount);
                    done();
                }
            });
        });

        it('label style removed when labels are inactive', function (done) {

            var style = {
                name: 'Gas Stations',
                labelRule: 'Labels'
            };

            var labelsActive = false;

            Ext.Ajax.request({
                url: '/resources/style/Test_Gas.xml',
                success: function (response) {
                    var sldXmlDoc = response.responseXML;

                    var origUserStyleCount = Ext.DomQuery.select('UserStyle', sldXmlDoc).length;
                    var updatedXmlDoc = layerFactory.removeUnusedUserStyleNodes(sldXmlDoc, style, labelsActive);
                    var newStyleCount = Ext.DomQuery.select('UserStyle', updatedXmlDoc).length;
                    expect(newStyleCount).to.be(origUserStyleCount - 1);
                    done();
                }
            });
        });

        it('all styles are displayed if the UserStyle has no name', function (done) {

            var style = {
                name: 'Foo'
            };

            var labelsActive = false;

            Ext.Ajax.request({
                url: '/resources/style/style2.xml',
                success: function (response) {
                    var sldXmlDoc = response.responseXML;

                    var origUserStyleCount = Ext.DomQuery.select('UserStyle', sldXmlDoc).length;
                    var updatedXmlDoc = layerFactory.removeUnusedUserStyleNodes(sldXmlDoc, style, labelsActive);
                    var newStyleCount = Ext.DomQuery.select('UserStyle', updatedXmlDoc).length;
                    expect(newStyleCount).to.be(origUserStyleCount);
                    done();
                }
            });
        });
    });

    describe('applySldToLayer', function () {

        it('SLD applied to layer', function (done) {

            var source = new ol.source.Vector();
            var layer = new ol.layer.Vector({
                source: source,
                labelsActive: true,
            });

            source.on('sldapplied', function () {
                // console.log(layer.getStyle());
                expect(source.get('timestamp')).to.not.be(null);
                done();
            });

            var style = {
                name: 'Gas Stations',
                labelRule: 'Labels'
            };

            Ext.Ajax.request({
                url: '/resources/style/Test_Gas.xml',
                success: function (response) {
                    var sldXmlDoc = response.responseXML;
                    layerFactory.applySldToLayer(layer, sldXmlDoc, style);
                }
            });
        });

        it('SLD applied to cluster layer', function (done) {

            var source = new ol.source.Cluster({
                source: new ol.source.Vector()
            });

            var layer = new ol.layer.Vector({
                source: source,
                labelsActive: true,
            });

            source.on('sldapplied', function () {
                // console.log(layer.getStyle());
                expect(source.get('timestamp')).to.not.be(null);
                done();
            });

            var style = {
                name: 'Gas Stations',
                labelRule: 'Labels'
            };

            Ext.Ajax.request({
                url: '/resources/style/Test_Gas.xml',
                success: function (response) {
                    var sldXmlDoc = response.responseXML;
                    layerFactory.applySldToLayer(layer, sldXmlDoc, style);
                }
            });
        });
    });

});
