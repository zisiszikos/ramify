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

module.exports = {
    findShop: _findShop,
    createShop: _createShop
};
