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
    }

});