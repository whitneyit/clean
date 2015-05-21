describe('clean', function () {

    'use strict';

    var
        logs,

        proxyquire = require('proxyquire'),

        mockDel = require('../mocks/del.mock'),

        clean = proxyquire('../../lib/clean', {
            'del' : mockDel,
            '@whitneyit/log' : {
                'info' : function (msg) {
                    // Don't pollute the console with actual logs.
                    // Here we just extract the name of the "cleaned" directory.
                    msg = msg.replace(/^.*?"/, '').replace(/".*/g, '');
                    logs.push(msg);
                }
            }
        });

    beforeEach(function () {
        logs           = [];
        mockDel.caught = null;
        mockDel.err    = null;
        mockDel.last   = null;
    });

    describe('(glob)', function () {

        it('should throw an Error if `glob` is not a String or an Array', function () {
            expect(function () { clean(123); }).toThrow(new TypeError('Expected `glob` to be a String or an Array'));
        });

        it('should convert a String `glob` into an Array', function (done) {
            var glob = 'lorem/ipsum.js';
            clean(glob, 'foo', function () {
                expect(mockDel.err).toEqual(null);
                expect([glob]).toEqual(mockDel.last);
                done();
            });
        });

    });

    describe('(name)', function () {

        it('should throw an Error if `name` is not a truthy String', function () {
            expect(function () { clean('glob', 123); }).toThrow(new TypeError('Expected `name` to be a String'));
            expect(function () { clean('glob', ''); }).toThrow(new TypeError('Expected `name` to be a String'));
        });

        it('should curry `name` into `done` if `name is a Function and use `glob[0]` as `name`', function (done) {
            var glob = 'foo/bar.js';
            clean(glob, function () {
                expect(glob).toEqual(logs[0]);
                done();
            });
        });

    });

    describe('(done)', function () {

        it('should throw an Error if `done` is not a Function', function () {
            expect(function () { clean('glob', 'name', 123); }).toThrow(new TypeError('Expected `done` to be a Function'));
        });

        describe('(callback)', function () {

            it('should rethrow any Errors encountered by `del`', function (done) {
                var err = new Error('callback error');
                mockDel.err = err;
                clean('glob', 'name', function () {
                    expect(mockDel.caught).toEqual(err);
                    done();
                });
            });

            it('should be called with a `null` as the Error argument if everything went well', function (done) {
                var glob = 'all/done.js';
                clean(glob, 'foo', function (err) {
                    expect(err).toBe(null);
                    done();
                });
            });

        });

    });

});

/* vim: set cc=0 : */
