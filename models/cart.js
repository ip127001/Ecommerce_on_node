const fs = require('fs')
const path = require('path')

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice) {
        //fetch the previos cart
        fs.readFile(p, (err, fileContent) => {
            let cart = {
                products: [],
                totalPrice: 0
            }
            if (!err) {
                cart = JSON.parse(fileContent);
            }

            // analyse the cart => find existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id)
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = { ...existingProduct
                };
                updatedProduct.qty = updatedProduct.qty + 1;

                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {
                    id: id,
                    qty: 1
                };
                cart.products = [...cart.products, updatedProduct]
            }
            // add new product / increase quantity
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log('error in cart.js', err);
            });
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            } else {
                const updatedCart = { ...JSON.parse(fileContent)
                };
                const product = updatedCart.products.find(prod => prod.id === id);
                const startIndex = updatedCart.products.indexOf(product);
                updatedCart.products = updatedCart.products.slice(startIndex, startIndex + 1);

                // updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
                updatedCart.totalPrice = updatedCart.totalPrice - (product.qty * productPrice);

                fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                    if (err) console.log(err);
                })
            }
        })
    }
}