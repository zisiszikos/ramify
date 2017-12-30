(function(name,definition){if(typeof define==="function"){define(definition)}else if(typeof module!=="undefined"&&module.exports){module.exports=definition()}else{var Ramify=definition();var global=this;var old=global[name];Ramify.noConflict=function(){global[name]=old;return Ramify};global[name]=Ramify}})("Ramify",function(){"use strict";function RamifyError(message){this.name=this.constructor.name;this.message=message||"";if(Error.captureStackTrace){Error.captureStackTrace(this,this.constructor)}else{this.stack=(new Error).stack}}RamifyError.prototype=Object.create(Error.prototype);RamifyError.prototype.constructor=RamifyError;var _rami=null;var _generalErrorHandler=null;var _returnValue=null;var _config={createAlias:false};var _this=null;var _properties={};function Rami(){}_this=new Rami;Rami.prototype.call=function(){return _call.apply(_this,arguments)};Rami.prototype.prop=function(){if(!arguments[0]||typeof arguments[0]!=="string"){if(typeof _generalErrorHandler==="function"){return _generalErrorHandler.call(this,new RamifyError("Prop name not specified."))}else{throw new RamifyError("Prop name not specified.")}}else{if(arguments.length>1){_properties[arguments[0]]=arguments[1]}else{return _properties[arguments[0]]}}};function Ramify(config){if(config!==null&&typeof config==="object"){var keysCount=Object.keys(this.config).length;for(var i=0;i<keysCount;i++){var configName=Object.keys(this.config)[i];if(config[configName]&&typeof this.config[configName]===typeof config[configName]){this.config[configName]=config[configName]}}}}Ramify.version="0.1.5";Ramify.author="Zisis Zikos";Ramify.RamifyError=RamifyError;Ramify.prototype.config=_config;Ramify.prototype.addRami=function(rami){if(rami!==null&&typeof rami==="object"){_rami=_rami||{};var keysCount=Object.keys(rami).length;for(var i=0;i<keysCount;i++){var ramusName=Object.keys(rami)[i];_rami[ramusName]=rami[ramusName];if(this.config.createAlias){Rami.prototype["_"+ramusName]=_call.bind(_this,ramusName);Ramify.prototype["_"+ramusName]=_call.bind(_this,ramusName)}}}return this};Ramify.prototype.addRamus=function(ramusName,ramusContent){if(!ramusName){if(typeof _generalErrorHandler==="function"){return _generalErrorHandler.call(this,new RamifyError("Ramus name is not specified."))}else{throw new RamifyError("Ramus name is not specified.")}return this}_rami=_rami||{};_rami[ramusName]=ramusContent;if(this.config.createAlias){Rami.prototype["_"+ramusName]=_call.bind(_this,ramusName);Ramify.prototype["_"+ramusName]=_call.bind(_this,ramusName)}return this};Ramify.prototype.setRamusContent=function(ramusName,ramusContent){if(!ramusName){if(typeof _generalErrorHandler==="function"){return _generalErrorHandler.call(this,new RamifyError("Ramus name is not specified."))}else{throw new RamifyError("Ramus name is not specified.")}return this}_rami=_rami||{};if(!_rami[ramusName]){if(typeof _generalErrorHandler==="function"){return _generalErrorHandler.call(this,new RamifyError("Given ramus name is not defined."))}else{throw new RamifyError("Given ramus name is not defined.")}return this}_rami[ramusName]=ramusContent;return this};Ramify.prototype.call=function(){return _call.apply(_this,arguments)};Ramify.prototype.catch=function(generalErrorHandler){_generalErrorHandler=generalErrorHandler;return this};function _call(){var errorHandler;if(!_rami){if(typeof _generalErrorHandler==="function"){return _generalErrorHandler.call(this,new RamifyError("Rami are not specified."))}else{throw new RamifyError("Rami are not specified.")}return this}if(arguments.length===0){if(typeof _generalErrorHandler==="function"){return _generalErrorHandler.call(this,new RamifyError("Ramus name is not specified."))}else{throw new RamifyError("Ramus name is not specified.")}return this}if(!_rami[arguments[0]]){errorHandler=arguments[2]||_generalErrorHandler;if(typeof errorHandler==="function"){return errorHandler.call(this,new RamifyError("Given ramus name is not defined."))}else{throw new RamifyError("Given ramus name is not defined.")}return this}var ramusName=arguments[0];if(typeof _rami[ramusName]==="function"){if(arguments.length>1&&!!arguments[1]&&typeof arguments[1].then==="function"){errorHandler=arguments[2]||_generalErrorHandler;return arguments[1].then(_rami[ramusName].bind(this),errorHandler&&errorHandler.bind(this))}else{var arg=null;if(arguments.length>1){arg=arguments[1]}errorHandler=arguments[2]||_generalErrorHandler;if(typeof errorHandler==="function"){try{return _rami[ramusName].call(this,arg)}catch(e){return errorHandler.call(this,e)}}else{return _rami[ramusName].call(this,arg)}}}else{return _rami[ramusName]}}return Ramify});