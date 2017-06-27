# Ramify examples

### Syncronous example ([syncronous1.html](syncronous1.html))

This is an example of combining syncronous functions for creating paths of actions.

```javascript
var mytree = new Ramify();

mytree.add({
    one: function () {

        this.call('two', Math.round(Math.random() * 10));
    },
    two: function (param) {

        if (param > 8) {
            this.call('three', param * 2);
        } else if (param > 3) {
            this.call('four', param * 2);
        } else {
            throw new Error('Just an error!');
        }
    },
    three: function (param) {

        document.querySelector('#main').innerHTML = 'Three: ' + param * 2;
    },
    four: function (param) {

        document.querySelector('#main').innerHTML = 'Four: ' + param * 3;
    }
}).catch(function (err) {

    console.log(err);
}).call('one');
```

---

### Asyncronous example 1 ([asyncronous1.html](asyncronous1.html))

This is an example of combining syncronous functions and promises for creating paths of actions.

```javascript
function myPromise (param) {

    return new Promise(function (resolve) {

        resolve(param + 5);
    });
}

var mytree = new Ramify();

mytree.add({
    func1: function () {

        return this.call('func2', Math.round(Math.random() * 10), Promise.reject);
    },
    func2: function (param) {

        if (param > 8) {
            return this.call('func3', param * 2);
        } else if (param > 3) {
            return this.call('func4', param * 2);
        } else {
            throw new Error('Just an error!');
        }
    },
    func3: function (param) {

        return Promise.resolve('aaa: ' + param * 2);
    },
    func4: function (param) {

        return this.call('func5', myPromise(param).delay(600));
    },
    func5: function (param) {

        return this.call('func6', myPromise(param).delay(600));
    },
    func6: function (param) {

        return Promise.resolve('bbb: ' + param * 3);
    }
}).catch(Promise.reject);

var result = mytree.call('func1');

result.then(function (result) {

    document.querySelector('#main').innerHTML = result;
}).catch(Ramify.Error, function (err) {

    console.log('RamifyError');
    console.log(err.stack);
}).catch(function (err) {

    console.log(err.stack);
});
```
---

### Asyncronous example 2 ([asyncronous2.html](asyncronous2.html))

This is an example of combining promises for creating paths of actions.

```javascript
var shopsService = new Ramify();
var rami = {};

function _findShop (name) {

    return new Promise(function (resolve, reject) {

        var temp = Math.random();
        if (temp > 0.7) {
            // could not find shop with this name
            resolve([]);
        } else if (temp > 0.4) {
            // shop found
            resolve([{
                id: '765454654565',
                name: name
            }]);
        } else {
            // An error occured while fetching from db
            reject(new Error('Something went wrong!'));
        }
    });
}

function _createShop (name) {

    return new Promise(function (resolve) {

        // create shop and return it
        resolve({
            id: '12342432423',
            name: name
        });
    });
}

rami.findOrCreateShop = function (shopName) {

    console.log('- Trying to find the shop');
    this.prop('shopName', shopName);
    return this.call('handleFindShopResponse', _findShop(shopName));
};

rami.handleFindShopResponse = function (shops) {

    if (shops.length > 0) {
        console.log('- Shop found');
        return this.call('constructResponse', shops[0]);
    } else {
        console.log('- Couldn\'t find shop, creating one');
        return this.call('handleCreateShopResponse', _createShop(this.prop('shopName')));
    }
};

rami.handleCreateShopResponse = function (newShop) {

    console.log('- Shop created');
    return this.call('constructResponse', newShop);
};

rami.constructResponse = function (shop) {

    console.log('- Returning the shop');
    shop.website = 'https://' + shop.name;

    return shop;
};

shopsService.add(rami).catch(Promise.reject);

shopsService.call('findOrCreateShop', 'myshop.com')
    .then(function (shop) {

        document.querySelector('#main').innerHTML = JSON.stringify(shop);
    }).catch(Ramify.Error, function (err) {

        console.log('+++++ Ramify Error +++++');
        console.log(err.stack);
    }).catch(function (err) {

        console.log('+++++ General Error +++++');
        console.log(err.stack);
    });
```

---

### Asyncronous example 3 ([asyncronous3.html](asyncronous3.html))

This is an example of combining promises for creating paths of actions.

```javascript
var shopsService = new Ramify();
var rami = {};

function _findShop (name) {

    return new Promise(function (resolve, reject) {

        var temp = Math.random();
        if (temp > 0.5) {
            // shop found
            resolve([{
                id: '3453454534',
                name: name
            }]);
        } else {
            // An error occured while fetching from db
            reject(new Error('Failed to fetch shop'));
        }
    });
}

rami.findShop = function (shopName) {

    // Optionally you can save variables on "this" object
    // (like "count" and "shopName") to use them
    // on other functions (Be careful not to overwrite
    // existing function names!)
    var count = this.prop('count');
    this.prop('count', Number.isInteger(count) ? count + 1 : 1 );
    // this.count = Number.isInteger(count) ? count + 1 : 1;
    console.log('Trying to find the shop. Try: ' + this.prop('count'));
    this.prop('shopName', shopName);
    // this.shopName = shopName;
    return this.call(
        'handleFindShopResponse',
        _findShop(shopName),
        function errorHandler(err) {

            if (err instanceof Ramify.Error) {
                throw err;
            }
            console.log(err.message);
            if (this.prop('count') < 3) {
                return this.call('findShop', this.prop('shopName'));
            } else {
                throw new Error('Retry limit reached.');
            }
        });
};

rami.handleFindShopResponse = function (shops) {

    console.log('Shop found after ' + this.prop('count') + ' tries');
    return shops[0];
};

shopsService.add(rami).catch(Promise.reject);

shopsService.call('findShop', 'myshop.com')
    .then(function (shop) {

        document.querySelector('#main').innerHTML = JSON.stringify(shop);
    }).catch(Ramify.Error, function (err) {

        console.log('+++++ Ramify Error Handler +++++');
        console.log(err.stack);
    }).catch(function (err) {

        console.log('+++++ General Error Handler +++++');
        console.log(err.stack);
    });
```
