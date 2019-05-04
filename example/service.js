var Ramify = require('../ramify.js');
var DB = require('./db.js');

var shopsService = new Ramify({
    createAlias: true,
    safeAlias: false
});

shopsService.add(function findOrCreateShop (shopName) {

    console.log('- Trying to find the shop');
    this.prop('shopName', shopName);

    var count = this.prop('count');
    this.prop('count', Number.isInteger(count) ? count + 1 : 1);

    console.log('Trying to find the shop. Try: ' + this.prop('count'));
    return this.handleFindShopResponse(DB.findShop(shopName),
        function errorHandler(err) {

            if (err instanceof Ramify.RamifyError) {
                throw err;
            }
            console.log(err.message);
            if (this.prop('count') < 3) {
                return this.findOrCreateShop(this.prop('shopName'));
            } else {
                throw new Error('Retry limit reached.');
            }
        });
});

shopsService.add(function handleFindShopResponse (shops) {

    console.log('Shop found after ' + this.prop('count') + ' tries');
    if (shops.length > 0) {
        console.log('- Shop found');
        return this.constructResponse(shops[0]);
    } else {
        console.log('- Couldn\'t find shop, creating one');
        return this.handleCreateShopResponse(DB.createShop(this.prop('shopName')));
    }
});

shopsService.add(function handleCreateShopResponse (newShop) {

    console.log('- Shop created');
    return this.constructResponse(newShop);
});

shopsService.add(function constructResponse (shop) {

    console.log('- Returning the shop');
    shop.website = 'https://' + shop.name;

    return shop;
});

module.exports = shopsService;
