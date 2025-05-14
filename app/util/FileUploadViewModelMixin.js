/**
 * A mixin to handle enabling and disabling of file uploader features
 *
 * To be mixed in to any viewmodel where the file upload functionality is required.
 *
 * Allows for file upload and deletion if:
 * - the parent record is not "phantom"
 * - the parent record is not "locked"
 * - the user belongs to the "browser read and write" role
 */
Ext.define('CpsiMapview.util.FileUploadViewModelMixin', {
    extend: 'Ext.Mixin',

    config: {
        formulas: {
            canAddFiles: {
                bind: {
                    currentRecord: '{currentRecord}',
                    isLocked: '{currentRecord.isLocked}',
                    phantom: '{currentRecord.phantom}'
                },
                get: function (data) {
                    let ret = data.isLocked !== true;
                    ret = ret && data.phantom !== true;
                    if (!this.getFormulas().belongsToRoleReadWrite) {
                        Ext.log({
                            msg: 'CpsiMapview.util.FileUploadViewModelMixin should be mixed into a viewmodel that implements role checks formulas'
                        });
                    } else {
                        ret =
                            ret &&
                            this.getFormulas().belongsToRoleReadWrite.call(
                                this,
                                this.formulaFn
                            );
                    }
                    return ret;
                }
            },

            canDeleteFiles: {
                bind: {
                    currentRecord: '{currentRecord}',
                    isLocked: '{currentRecord.isLocked}',
                    phantom: '{currentRecord.phantom}'
                },
                get: function (data) {
                    let ret = data.isLocked !== true && !data.phantom;
                    ret = ret && data.phantom !== true;
                    if (!this.getFormulas().belongsToRoleReadWrite) {
                        Ext.log({
                            msg: 'CpsiMapview.util.FileUploadViewModelMixin should be mixed into a viewmodel that implements role checks formulas'
                        });
                    } else {
                        ret =
                            ret &&
                            this.getFormulas().belongsToRoleReadWrite.call(
                                this,
                                this.formulaFn
                            );
                    }
                    return ret;
                }
            }
        }
    }
});
