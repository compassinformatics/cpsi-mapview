/**
 * A singleton class used to check user roles
 * stored in cookies
 *
 * @class CpsiMapview.util.RoleManager
 */
Ext.define('CpsiMapview.util.RoleManager', {
    singleton: true,
    /**
     * Check if the user has the role by checking all the roles
     * returned by the login service and saved in a cookie
     * @param {any} role
     */
    checkRole: function (role) {

        var hasRole = false;
        var roles = Ext.util.Cookies.get('roles');

        if (roles) {
            // create a list of roles and check for the role name
            if (roles.split(',').indexOf(role) >= 0)
                hasRole = true;
        }

        return hasRole;
    },

    /**
     * Removes layers which the user is not allowed to see.
     *
     * @param {Array} children An array of layer children
     * @return {Array} The modified children array
     */
    updateTreeChildrenByRole: function(children){
        var result = [];
        Ext.each(children, function(child){
            var showNode = true;
            if (child.leaf) {
                var requiredRoles = child.requiredRoles;
                // check if user is allowed to see layer
                if (Ext.isArray(requiredRoles) && requiredRoles.length){
                    showNode = false;
                    Ext.each(requiredRoles, function(role){
                        var userHasRole = CpsiMapview.util.RoleManager.checkRole(role);
                        if (userHasRole){
                            showNode = true;
                        }
                    });
                }
            } else {
                child.children = CpsiMapview.util.RoleManager.updateTreeChildrenByRole(child.children);
            }
            if (showNode) {
                result.push(child);
            }
        });
        return result;
    }
});
