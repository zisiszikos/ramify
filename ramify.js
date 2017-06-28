(function(name, definition) {

    if (typeof define === 'function') { // AMD
        define(definition);
    } else if (typeof module !== 'undefined' && module.exports) { // Node.js
        module.exports = definition();
    } else { // Browser
        var Ramify = definition();
        var global = this;
        var old = global[name];

        Ramify.noConflict = function() {

            global[name] = old;
            return Ramify;
        };

        global[name] = Ramify;
    }
})('Ramify', function() {

    'use strict';

    function RamifyError(message) {

        this.name = this.constructor.name;
        this.message = message || '';
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error()).stack;
        }
    }
    RamifyError.prototype = Object.create(Error.prototype);
    RamifyError.prototype.constructor = RamifyError;

    var _rami = null;
    var _generalErrorHandler = null;
    var _returnValue = null;
    var _config = {};
    var _this = null;
    var _properties = {};

    function Rami() {}

    _this = new Rami();

    Rami.prototype.call = function() {

        return _call.apply(_this, arguments);
    };

    Rami.prototype.prop = function() {

        if (arguments.length > 1 && typeof arguments[0] === 'string') {
            _properties[arguments[0]] = arguments[1];
            return _properties[arguments[0]];
        } else if (arguments.length === 1 && typeof arguments[0] === 'string') {
            return _properties[arguments[0]];
        }

        return null;
    };

    function Ramify(config) {

        if (config !== null && typeof config === 'object') {
            var keysCount = Object.keys(this.config).length;
            for (var i = 0; i < keysCount; i++) {
                var configName = Object.keys(this.config)[i];
                if (config[configName] &&
                    typeof this.config[configName] === typeof config[configName]) {
                    this.config[configName] = config[configName];
                }
            }
        }
    }

    Ramify.version = '0.1.0';
    Ramify.author = 'Zisis Zikos';

    Ramify.Error = RamifyError;

    Ramify.prototype.config = _config;

    Ramify.prototype.add = function(rami) {

        if (rami !== null && typeof rami === 'object') {
            var keysCount = Object.keys(rami).length;
            for (var i = 0; i < keysCount; i++) {
                var ramusName = Object.keys(rami)[i];
                if (typeof rami[ramusName] === 'function') {
                    _rami = _rami || {};
                    _rami[ramusName] = rami[ramusName];
                }
            }
        }

        return this;
    };

    Ramify.prototype.call = function() {

        return _call.apply(_this, arguments);
    };

    Ramify.prototype.catch = function(generalErrorHandler) {

        _generalErrorHandler = generalErrorHandler;
        return this;
    };

    function _call () {

        var errorHandler;

        if (!_rami) {
            if (typeof _generalErrorHandler === 'function') {
                return _generalErrorHandler.call(this, new RamifyError('Rami are not specified.'));
            } else {
                throw new RamifyError('Rami are not specified.');
            }
            return this;
        }

        if (arguments.length === 0) {
            if (typeof _generalErrorHandler === 'function') {
                return _generalErrorHandler.call(this, new RamifyError('Ramus name is not specified.'));
            } else {
                throw new RamifyError('Ramus name is not specified.');
            }
            return this;
        }

        if (!_rami[arguments[0]]) {
            errorHandler = arguments[2] || _generalErrorHandler;
            if (typeof errorHandler === 'function') {
                return errorHandler.call(this, new RamifyError('Given ramus name is not defined.'));
            } else {
                throw new RamifyError('Given ramus name is not defined.');
            }
            return this;
        }

        if (arguments.length > 1 && !!arguments[1] && typeof arguments[1].then === 'function') {
            var ramusName = arguments[0];
            errorHandler = arguments[2] || _generalErrorHandler;
            return arguments[1].then(_rami[ramusName].bind(this), errorHandler && errorHandler.bind(this));
        } else {
            var arg = null;
            if (arguments.length > 1) {
                arg = arguments[1];
            }

            errorHandler = arguments[2] || _generalErrorHandler;
            if (typeof errorHandler === 'function') {
                try {
                    return _rami[arguments[0]].call(this, arg);
                } catch (e) {
                    return errorHandler.call(this, e);
                }
            } else {
                return _rami[arguments[0]].call(this, arg);
            }
        }
    };

    return Ramify;
});