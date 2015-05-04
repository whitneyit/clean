'use strict';

var
    /**
     * @name whitneyit.log.tests.mocks.del#caught
     *
     * @description
     * The caught Error.
     */
    caught = null,

    /**
     * @name whitneyit.log.tests.mocks.del#err
     *
     * @description
     * The Error to throw.
     */
    err = null,

    /**
     * @name whitneyit.log.tests.mocks.del#last
     *
     * @description
     * The previous glob that was passed in.
     */
    last = null,

    /**
     * @name whitneyit.clean.tests.mocks.del
     *
     * @description
     * Pretends to delete a `glob` then executes a callback; `cb`.
     *
     * @param {Array} glob  - The paths to match. This is not being used for the
     *                        mock so it is not required. It is only used so
     *                        that the mock Function signature matches that of
     *                        real implementation of `del`. It is however
     *                        attach to the `del` Function that that it can be
     *                        inspected during the tests.
     * @param {Function} cb - The Function to be called upon "deleting" the
     *                        Array of paths from `glob`.
     *
     * @return {Void}
     */
    del = function mockDel (glob, cb) {
        setTimeout(function () {
            del.last = glob;
            try {
                cb(del.err);
            } catch (e) {
                del.caught = e;
                cb(null);
            }
        }, 0);
    };

// Extend the `del` mock.
del.caught = caught;
del.err    = err;
del.last   = last;

// Expose to node.
module.exports = del;
