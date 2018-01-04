(function(name, definition) {
    if (typeof define === 'function') {
        // AMD
        define(definition);
    } else if (typeof module !== 'undefined' && module.exports) {
        // Node.js
        module.exports = definition();
    } else {
        // Browser
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

    /**
     * Represents an error occured at the Ramify execution process.
     * @class Ramify.RamifyError
     * @param {string} [message] The message property of the created
     * error instance
     * @example
     * var Ramify = require('ramify');
     * ...
     * throw new Ramify.RamifyError('Something went wrong');
     * ...
     * try {
     * ...
     * } catch (e if e instanceof Ramify.RamifyError) {}
     */
    function RamifyError(message) {
        this.name = this.constructor.name;
        this.message = message || '';
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = new Error().stack;
        }
    }
    RamifyError.prototype = Object.create(Error.prototype);
    RamifyError.prototype.constructor = RamifyError;

    var _rami = null;
    var _generalErrorHandler = null;
    var _returnValue = null;
    var _config = {
        createAlias: false,
        safeAlias: true
    };
    var _this = null;
    var _properties = {};

    /**
     * Represents the inner Rami object of the Rami functions,
     * assigned to `this` object.
     * @class Rami
     * @memberOf Ramify
     * @inner
     */
    function Rami() {}

    _this = new Rami();

    /**
     * Adds functions to the Ramify instance that will be used within it.
     * @function Ramify~Rami#call
     * @this Ramify~Rami
     * @param {!string} ramusName The name of the ramus to call.
     * @param {*} [passedParameter] The value the will be applied as a parameter to the called function. Could be any value, even a Promise. If a Promise is passed, the Promise will be automatically evaluated and the resolved value will be passed as a parameter, otherwise the rejected value will be passed to the errorHandler function. If no errorHandler function is declared, the generalErrorHandler function will be called.
     * @param {function} [errorHandler] A function that will handle the errors that can happen at a Promise that is passed as a parameter.
     * @returns {*} The resolved value.
     * @example
     * var myController = new Ramify();
     * function somePromise () {
     *     return new Promise(function (resolve, reject) {
     *         resolve('someValue');
     *     });
     * }
     * myController.add({
     *     someFunction: () {
     *         return this.call('someOtherFunction', somePromise(), function (err) {
     *             console.log(err);
     *         });
     *     },
     *     someOtherFunction: (value) {
     *         return this.call('endFunction', value + '123');
     *     },
     *     endFunction: function (value) {
     *         return value;
     *     }
     * });
     * myController.call('someFunction');
     */
    Rami.prototype.call = function() {
        return _call.apply(_this, arguments);
    };

    /**
     * Attached to `this` of a function declared within Ramify instance, either to get or set a property.
     *
     * _Allthough a property can be set directly to `this` object, (`this.someProp = someValue`) it is not recommended to write on to the Rami object. `prop` method is a safe way to pass values between Rami functions._
     * @function Ramify~Rami#prop
     * @param {!string} propertyName The name of the property to get or set.
     * @param {*} [propertyValue] The value to be set.
     * @returns {null|*} Returns `null` when setting the value, or the value when getting it.
     * @example
     * var myController = new Ramify();
     * myController.add({
     *     someFunction: () {
     *         this.prop('someProp', 'someValue');
     *         // do something
     *     },
     *     someOtherFunction: () {
     *         var v = this.prop('someProp');
     *         // do something else
     *     }
     * });
     */
    Rami.prototype.prop = function() {
        if (!arguments[0] || typeof arguments[0] !== 'string') {
            if (typeof _generalErrorHandler === 'function') {
                return _generalErrorHandler.call(this, new RamifyError('Prop name not specified.'));
            } else {
                throw new RamifyError('Prop name not specified.');
            }
        } else {
            if (arguments.length > 1) {
                _properties[arguments[0]] = arguments[1];
            } else {
                return _properties[arguments[0]];
            }
        }
    };

    /**
     * Creates a new instance of the Ramify object.
     * @class Ramify
     * @param {Ramify#config} [config] An Object containing the configurations.
     * @example
     * var Ramify = require('ramify');
     * var myController = new Ramify();
     */
    function Ramify(config) {
        if (config !== null && typeof config === 'object') {
            var keysCount = Object.keys(this.config).length;
            for (var i = 0; i < keysCount; i++) {
                var configName = Object.keys(this.config)[i];
                if (typeof this.config[configName] === typeof config[configName]) {
                    this.config[configName] = config[configName];
                }
            }
        }
    }

    /**
     * Returns the current version of Ramify package.
     * @member {string} version
     * @memberof Ramify
     * @static
     */
    Ramify.version = '0.3.1';

    /**
     * Returns the author of Ramify package.
     * @member {string} author
     * @memberof Ramify
     * @static
     */
    Ramify.author = 'Zisis Zikos';

    Ramify.RamifyError = RamifyError;

    /**
     * A reference to internal `this` object.
     * @member {Ramify~Rami} context
     * @memberof Ramify
     * @instance
     */
    Ramify.prototype.context = _this;

    /**
     * The Ramify instance configuration.
     * @member {Object} config
     * @memberof Ramify
     * @instance
     * @property {boolean} createAlias=false Whether alias methods should be
     * created for every ramus, at the inner Rami object. **Note:** Alias methods
     * are dangerous because calling a method that doesn't exists will result
     * in an unhandled exception. Instead, the `.call` method handles this kind
     * of errors.
     * @property {boolean} safeAlias=true Whether alias methods should be
     * prepended with an underscore for safety (not overwriting existing methods).
     */
    Ramify.prototype.config = _config;

    /**
     * Adds functions to the Ramify instance that will be used within it.
     * @function Ramify#addAll
     * @param {!Object} rami The Object that contains the functions as Object properties.
     * @returns {Ramify} The instance of current Ramify object.
     * @example
     * var myController = new Ramify();
     * myController.addAll({
     *     someRamus: function () {
     *         // do something
     *     },
     *     someOtherRamus: function () {
     *         // do something else
     *     },
     *     anotherRamus: 'foo'
     * });
     */
    Ramify.prototype.addAll = function(rami) {
        if (rami !== null && typeof rami === 'object') {
            _rami = _rami || {};
            var keysCount = Object.keys(rami).length;
            for (var i = 0; i < keysCount; i++) {
                var ramusName = Object.keys(rami)[i];
                _rami[ramusName] = rami[ramusName];
                if (this.config.createAlias) {
                    var properyName = this.config.safeAlias ? '_' + ramusName : ramusName;
                    Rami.prototype[properyName] = _call.bind(_this, ramusName);
                    Ramify.prototype[properyName] = _call.bind(_this, ramusName);
                }
            }
        }

        return this;
    };

    /**
     * Adds a function to the Ramify instance that will be used within it.
     * @function Ramify#add
     * @param {!string} ramusName The name of the ramus.
     * @param {*} [ramusContent] The content of the current ramus.
     * @returns {Ramify} The instance of current Ramify object.
     * @example
     * var myController = new Ramify();
     * myController.add('aRamusName', function () {
     *     // do something
     * });
     * myController.add('anotherRamusName', 'someValue');
     * myController.add('someOtherRamusName');
     */
    Ramify.prototype.add = function(ramusName, ramusContent) {
        if (!ramusName) {
            if (typeof _generalErrorHandler === 'function') {
                return _generalErrorHandler.call(this, new RamifyError('Ramus name is not specified.'));
            } else {
                throw new RamifyError('Ramus name is not specified.');
            }
            return this;
        }

        _rami = _rami || {};
        _rami[ramusName] = ramusContent;
        if (this.config.createAlias) {
            var properyName = this.config.safeAlias ? '_' + ramusName : ramusName;
            Rami.prototype[properyName] = _call.bind(_this, ramusName);
            Ramify.prototype[properyName] = _call.bind(_this, ramusName);
        }

        return this;
    };

    /**
     * Sets the content of a ramus.
     * @function Ramify#setContent
     * @param {!string} ramusName The name of the ramus.
     * @param {*} [ramusContent] The content of the current ramus.
     * @returns {Ramify} The instance of current Ramify object.
     * @example
     * var myController = new Ramify();
     * myController.setContent('aRamusName', function () {
     *     // do something
     * });
     * myController.setContent('anotherRamusName', 'someValue');
     */
    Ramify.prototype.setContent = function(ramusName, ramusContent) {
        if (!ramusName) {
            if (typeof _generalErrorHandler === 'function') {
                return _generalErrorHandler.call(this, new RamifyError('Ramus name is not specified.'));
            } else {
                throw new RamifyError('Ramus name is not specified.');
            }
            return this;
        }

        _rami = _rami || {};

        if (!_rami[ramusName]) {
            if (typeof _generalErrorHandler === 'function') {
                return _generalErrorHandler.call(this, new RamifyError('Given ramus name is not defined.'));
            } else {
                throw new RamifyError('Given ramus name is not defined.');
            }
            return this;
        }

        _rami[ramusName] = ramusContent;

        return this;
    };

    /**
     * Gets the content of a ramus.
     * @function Ramify#getContent
     * @param {!string} ramusName The name of the ramus.
     * @returns {*} The content of the current ramus.
     * @example
     * var myController = new Ramify();
     * var content = myController.getContent('aRamusName');
     */
    Ramify.prototype.getContent = function(ramusName) {
        if (!ramusName) {
            if (typeof _generalErrorHandler === 'function') {
                return _generalErrorHandler.call(this, new RamifyError('Ramus name is not specified.'));
            } else {
                throw new RamifyError('Ramus name is not specified.');
            }
            return this;
        }

        _rami = _rami || {};
        var ramusContent = _rami[ramusName];

        if (!ramusContent) {
            if (typeof _generalErrorHandler === 'function') {
                return _generalErrorHandler.call(this, new RamifyError('Given ramus name is not defined.'));
            } else {
                throw new RamifyError('Given ramus name is not defined.');
            }
            return this;
        }

        return ramusContent;
    };

    /**
     * Adds functions to the Ramify instance that will be used within it.
     * @function Ramify#call
     * @this Ramify~Rami
     * @param {!string} ramusName The name of the ramus to call.
     * @param {*} [passedParameter] The value the will be applied as a parameter to the called function. Could be any value, even a Promise. If a Promise is passed, the Promise will be automatically evaluated and the resolved value will be passed as a parameter, otherwise the rejected value will be passed to the errorHandler function. If no errorHandler function is declared, the generalErrorHandler function will be called.
     * @param {function} [errorHandler] A function that will handle the errors that can happen at a Promise that is passed as a parameter.
     * @returns {*} The resolved value.
     * @example
     * var myController = new Ramify();
     * function somePromise () {
     *     return new Promise(function (resolve, reject) {
     *         resolve('someValue');
     *     });
     * }
     * myController.add({
     *     someFunction: () {
     *         return this.call('someOtherFunction', somePromise(), function (err) {
     *             console.log(err);
     *         });
     *     },
     *     someOtherFunction: (value) {
     *         return this.call('endFunction', value + '123');
     *     },
     *     endFunction: function (value) {
     *         return value;
     *     }
     * });
     * myController.call('someFunction');
     */
    Ramify.prototype.call = function() {
        return _call.apply(_this, arguments);
    };

    /**
     * When used, it will handle all the errors that were not caught at the specific error handlers.
     * @function Ramify#catch
     * @param {function} generalErrorHandler The general error handle function.
     * @returns {Ramify} The current Ramify instance.
     * @example
     * var myController = new Ramify();
     * myController.add(Rami).catch(Promise.reject);
     * myController.call('someFunction', 'someValue')
     *     .then(function () {
     *         // do something
     *     }).catch(Ramify.RamifyError, function (err) {

     *         console.log('+++++ Ramify Error Handler +++++');
     *         console.log(err.stack);
     *     }).catch(function (err) {

     *         console.log('+++++ General Error Handler +++++');
     *         console.log(err.stack);
     *     });
     */
    Ramify.prototype.catch = function(generalErrorHandler) {
        _generalErrorHandler = generalErrorHandler;
        return this;
    };

    function _call() {
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

        var ramusName = arguments[0];

        if (typeof _rami[ramusName] === 'function') {
            if (arguments.length > 1 && !!arguments[1] && typeof arguments[1].then === 'function') {
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
                        return _rami[ramusName].call(this, arg);
                    } catch (e) {
                        return errorHandler.call(this, e);
                    }
                } else {
                    return _rami[ramusName].call(this, arg);
                }
            }
        } else {
            return _rami[ramusName];
        }
    }

    return Ramify;
});
