describe('CpsiMapview.util.RoleManager', function () {
    var cmp = CpsiMapview.util.RoleManager;

    var input = [
        {
            'id': 'overlay-folder',
            'title': 'Layers',
            'expanded': true,
            'checked': false,
            'children': [
                {
                    'id': 'LA_SITES',
                    'text': 'Local Authority Sites',
                    'leaf': true,
                    'requiredRoles': ['EDITOR_ROLE']
                },
                {
                    'id': 'RUINS_WFS',
                    'leaf': true,
                    'text': 'Ruins',
                    'qtip': 'Right-click for a layer grid',
                    'requiredRoles': ['VIEWER_ROLE']
                },
                {
                    'id': 'NODES_WFS',
                    'leaf': true,
                    'text': 'Nodes',
                    'qtip': 'Used in the snapping tool example',
                    'requiredRoles': ['VIEWER_ROLE', 'EDITOR_ROLE']
                },
                {
                    'id': 'EDGES_WFS',
                    'leaf': true,
                    'text': 'Edges',
                    'qtip': 'Used in the snapping tool example',
                    'requiredRoles': ['ADMIN_ROLE']
                }
            ]
        },
        {
            'id': 'base-folder',
            'title': 'Base Layers',
            'expanded': true,
            'children': [
                {
                    'id': 'GREY_BACKGROUND',
                    'leaf': true,
                    'text': 'Grey Background',
                    'qtip': 'This is the background layer',
                    'cls': 'cpsi-tree-node-baselayer'
                }
            ]
        }];

    var expected =  [
        {
            'id': 'overlay-folder',
            'title': 'Layers',
            'expanded': true,
            'checked': false,
            'children': [
                {
                    'id': 'LA_SITES',
                    'text': 'Local Authority Sites',
                    'leaf': true,
                    'requiredRoles': ['EDITOR_ROLE']
                },
                {
                    'id': 'RUINS_WFS',
                    'leaf': true,
                    'text': 'Ruins',
                    'qtip': 'Right-click for a layer grid',
                    'requiredRoles': ['VIEWER_ROLE']
                },
                {
                    'id': 'NODES_WFS',
                    'leaf': true,
                    'text': 'Nodes',
                    'qtip': 'Used in the snapping tool example',
                    'requiredRoles': ['VIEWER_ROLE', 'EDITOR_ROLE']
                }
            ]
        },
        {
            'id': 'base-folder',
            'title': 'Base Layers',
            'expanded': true,
            'children': [
                {
                    'id': 'GREY_BACKGROUND',
                    'leaf': true,
                    'text': 'Grey Background',
                    'qtip': 'This is the background layer',
                    'cls': 'cpsi-tree-node-baselayer'
                }
            ]
        }];

    describe('Basics', function () {
        it('is defined', function () {
            expect(cmp).not.to.be(undefined);
        });
    });

    describe('Functions', function () {

        it('#checkRole', function () {
            var fn = cmp.checkRole;
            expect(fn).not.to.be(undefined);
        });

        it('#updateTreeChildrenByRole', function () {
            var fn = cmp.updateTreeChildrenByRole;
            expect(fn).not.to.be(undefined);

            // mock that user has roles: EDITOR_ROLE and VIEWER_ROLE
            CpsiMapview.util.RoleManager.checkRole = function (role) {
                return role === 'EDITOR_ROLE' || role === 'VIEWER_ROLE';
            };

            // we expect that the item "EDGES_WFS" is removed from the result,
            // because it requires the role "ADMIN_ROLE" which the user does not have
            var resultString =JSON.stringify(fn(input));
            var expectedString = JSON.stringify(expected);
            expect(resultString).to.equal(expectedString);
        });
    });
}
);
