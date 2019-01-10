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
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            products.forEach(product => {
                const cartProductData = cart.products.find(prod => prod.id === product.id)
                if (cartProductData) {
                    cartProducts.push({
                        productData: product,
                        qty: cartProductData.qty
                    });
                }
            })
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'your cart',
                products: cartProducts,
                totalPrice: cart.totalPrice
            })
        })
    })

}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    })
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'your orders'
    })
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
}

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