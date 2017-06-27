# Ramify

> Unchain promises

Ramify is a lightweight library with zero dependencies which provides a simple way to create complex paths of functions and promises for easier handling the different scenarios that can happen in a chain of actions.

It supports both browser and Node.js environments. At a browser it exposes a global variable, `Ramify`.

---

### Installation and usage

Using [npm](https://www.npmjs.org/):

```
npm install --save ramify

var ramify = require('ramify');
```

Using [Bower](http://bower.io/):

```
bower install --save ramify

var ramify = new Ramify();
```

---

### API documentation

#### Ramify.add(Rami)
Adds the functions to the Ramify instance that will be used within it.
##### `Rami`: Object
The Object that contains the functions as Object properties.
```javascript
var ramify = new Ramify();
ramify.add({
    someFunction: () {
        /* do something */
    },
    someOtherFunction: () {
        /* do something else */
    }
});
```

#### Ramify.call(functionName \[, passedParameter, errorHandler\])
Calls a previous declared function and optionally pass a parameter (some value or a promise) and an error handler for the errors thrown within the promise that was called. `call` can be used either from the Ramify instance or from `this` Object inside the declared functions.
##### `functionName`: String
The name of the function to be called.
##### `passedParameter`: Any
The value the will be applied as a parameter to the called function. Could be any value, even a Promise. If a Promise is passed, the Promise will be automatically evaluated and the resolved value will be passed as a parameter, otherwise the rejected value will be passed to the error handle function. If no error handle function is declared, the generic error handle function will be called.
##### `errorHandler`: Function
A function that will handle the errors that can happen at a Promise that is passed as a parameter.
```javascript
var ramify = new Ramify();
function somePromise () {
    return new Promise(function (resolve, reject) {
        resolve('someValue');
    });
}
ramify.add({
    someFunction: () {
        this.call('someOtherFunction', somePromise(), function (err) {
            console.log(err);
        });
    },
    someOtherFunction: (value) {
        this.call('endFunction', value + '123');
    },
    endFunction: function (value) {
        return value;
    }
});
ramify.call('someFunction');
```

#### Ramify.catch(generalErrorHandler)
When used, it will handle all the errors that were not caught at the specific error handlers.
##### `generalErrorHandler`: Function
The general error handle function.
```javascript
var ramify = new Ramify();
ramify.add(Rami).catch(Promise.reject);
ramify.call('someFunction', 'someValue')
    .then(function () {
        /* do something */
    }).catch(Ramify.Error, function (err) {

        console.log('+++++ Ramify Error Handler +++++');
        console.log(err.stack);
    }).catch(function (err) {

        console.log('+++++ General Error Handler +++++');
        console.log(err.stack);
    });
```

#### this.prop(propertyName \[, propertyValue\])
Attached to `this` of a function declared within Ramify instance, either to get or set a property.
##### `propertyName`: String
The name of the property to get or set.
##### `propertyValue`: Any
The property value to be set.
```javascript
var ramify = new Ramify();
ramify.add({
    someFunction: () {
        this.prop('someProp', 'someValue');
        /* do something */
    },
    someOtherFunction: () {
        var v = this.prop('someProp');
        /* do something else */
    }
});
```
---

### [Examples](examples)
