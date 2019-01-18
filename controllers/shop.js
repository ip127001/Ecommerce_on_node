const Product = require('../models/product');
const Cart = require('../models/cart')

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All products',
                path: '/products'
            })
        })
        .catch(err => {
            console.log(err);
        });
    // res.sendFile(pa th.join(dirName, 'views', 'shop.html'));
};

exports.getProductDetails = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'shop',
                path: '/'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
        .catch(err => console.log(err));

}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            // console.log('added cart item', result);
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .deleteCartById(prodId)
        .then(product => {
            console.log('product deleted')
            res.redirect('/cart');
        })
        .catch(err => {;
        })
}

exports.postOrder = (req, res, next) => {
    console.log('postorder')
    req.user
        .addOrder()
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log('--error in postOrder module-- \n', err);
        })
}

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders()
        .then(orders => {
            console.log('orders are here \n', orders);
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'your orders',
                orders: orders
            })
        })
        .catch(err => {
            console.log(err);
        })
}