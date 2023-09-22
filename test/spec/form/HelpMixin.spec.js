Ext.define('CpsiMapview.form.TestHelpController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.TestHelpController',
    mixins: ['CpsiMapview.form.HelpMixin']
});

describe('CpsiMapview.form.HelpMixin', function () {

    Ext.Loader.syncRequire(['CpsiMapview.form.HelpMixin']);

    it('is defined', function () {
        expect(CpsiMapview.form.HelpMixin).not.to.be(undefined);
    });

    it('can be instantiated', function () {
        var inst = Ext.create('CpsiMapview.form.HelpMixin');
        expect(inst).to.be.a(CpsiMapview.form.HelpMixin);
    });

    describe('Functions', function () {

        var editForm;

        beforeEach(function () {

            // create a new view with the controller and mixin
            editForm = Ext.create('Ext.window.Window', {
                viewModel: {
                    helpUrl: ''
                },
                controller: {
                    type: 'TestHelpController'
                }
            });

        });

        afterEach(function () {
            // reset the application value
            Ext.app.Application.instance.rootHelpUrl = '';
        });

        it('check a URL is built with a root URL', function () {

            Ext.app.Application.instance.rootHelpUrl = 'http://localhost/';
            editForm.getViewModel().set('helpUrl', 'path/page.html');

            var ctrl = editForm.getController();
            var fullUrl = ctrl.onHelp();

            expect(fullUrl).to.be('http://localhost/path/page.html');
        });

        it('check a URL can override a root URL', function () {

            Ext.app.Application.instance.rootHelpUrl = 'http://localhost/';
            editForm.getViewModel().set('helpUrl', 'http://localhost2/path/page.html');

            var ctrl = editForm.getController();
            var fullUrl = ctrl.onHelp();

            expect(fullUrl).to.be('http://localhost2/path/page.html');
        });

        it('check a URL without a root URL', function () {

            Ext.app.Application.instance.rootHelpUrl = '';
            editForm.getViewModel().set('helpUrl', './path/page.html');

            var ctrl = editForm.getController();
            var fullUrl = ctrl.onHelp();

            expect(fullUrl).to.be('./path/page.html');
        });

        it('check double slashes are removedL', function () {

            Ext.app.Application.instance.rootHelpUrl = 'http://localhost/';
            editForm.getViewModel().set('helpUrl', '/path/page.html');

            var ctrl = editForm.getController();
            var fullUrl = ctrl.onHelp();

            expect(fullUrl).to.be('http://localhost/path/page.html');
        });
    });
});
