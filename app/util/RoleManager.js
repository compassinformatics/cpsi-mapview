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
     * Checks if user has at least one of the required roles.
     *
     * @param {String[]} requiredRoles The required roles.
     * @return {Boolean} True, if user has at least one of the required roles. False, otherwise.
     */
    hasAtLeastOneRequiredRole: function (requiredRoles) {
        var result = false;
        Ext.each(requiredRoles, function(role){
            var userHasRole = CpsiMapview.util.RoleManager.checkRole(role);
            if (userHasRole){
                result = true;
            }
        });
        return result;
    }
});
