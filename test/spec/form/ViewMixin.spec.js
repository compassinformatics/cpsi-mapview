Ext.define('CpsiMapview.form.TestWindow', {
    extend: 'Ext.window.Window',
    mixins: ['CpsiMapview.form.ViewMixin'],
    viewModel: {},
    tools: [{
        type: 'help'
    }]
});

describe('CpsiMapview.form.ViewMixin', function () {

    it('is defined', function () {
        expect(CpsiMapview.form.ViewMixin).not.to.be(undefined);
    });

    it('can be instantiated', function () {
        var inst = Ext.create('CpsiMapview.form.ViewMixin');
        expect(inst).to.be.a(CpsiMapview.form.ViewMixin);
    });

    describe('Functions', function () {

        var editWindow;
        var buttonBar;

        beforeEach(function () {

            // create a new view with the mixin
            editWindow = Ext.create('CpsiMapview.form.TestWindow');
            editWindow.show(); // we need to show the window to create the tools
            buttonBar = editWindow.down('buttonBar');
        });

        it('buttonBar is defined', function () {
            expect(buttonBar).not.to.be(undefined);
        });

        it('helpUrl is defined', function () {
            var helpUrl = editWindow.getViewModel().get('helpUrl');
            expect(helpUrl).to.be('');
        });

        it('tools are defined', function () {
            expect(editWindow.tools.length).to.be(3); // help, close, and padlock
        });
    });
});
