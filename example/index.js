var ShopsService = require('./service.js');

ShopsService.findOrCreateShop('myshop.com')
    .then(function (shop) {

        console.log('Success!');
        console.log(shop);
    }).catch(ShopsService.RamifyError, function (err) {

        console.log('+++++ Ramify Error +++++');
        console.log(err.stack);
    }).catch(function (err) {

        console.log('+++++ General Error +++++');
        console.log(err.stack);
    });
