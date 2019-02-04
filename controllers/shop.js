const fs = require('fs');
const path = require('path')

const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            // console.log('products from getProducts', products);
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All products',
                path: '/products',
                isAuthenticated: req.session.isLoggedIn
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
                path: '/products',
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getIndex = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split(';')[1].trim().split('=')[1] === 'true';
    Product.find()
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
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
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
        .catch(err => {
            console.log(err);
        })
}

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            console.log(user);
            const products = user.cart.items.map(item => {
                return {
                    productData: { ...item.productId._doc
                    },
                    quantity: item.quantity
                }
            });

            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products: products
            });

            return order.save();
        })
        .then(result => {
            return req.user.clearCart()
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log('--error in postOrder module-- \n', err);
        })
}

exports.getOrders = (req, res, next) => {
    Order.find({
            "user.userId": req.user._id
        })
        .then(orders => {
            // console.log('orders are here \n', orders);
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

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                console.log("no order found to your account");
                return next(new Error('no order found'))
            }
            if (order.user.userId === req.user._id) {
                console.log("unauthorized for order invoice");
                return next(new Error('unauthorized used'));
            }
            const invoiceName = 'invoice-' + orderId + '.pdf';
            const invoicePath = path.join('data', 'invoices', invoiceName)

            const pdfDoc = new PDFDocument(); //readable stream
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                'attachment; filename="' + invoiceName + '"');

            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);

            pdfDoc.text('Invoice for your Order');
            pdfDoc.text('-----------------------');
            let totalPrice = 0;
            order.products.forEach(prod => {
                totalPrice += prod.quantity * prod.productData.price;
                pdfDoc.text(prod.productData.title + ' - ' + prod.quantity + ' x ' + '$' + prod.productData.price);
            })
            pdfDoc.text('-------')
            pdfDoc.text('totalPrice= $' + totalPrice);
            pdfDoc.end();

            // fs.readFile(invoicePath, (err, data) => {
            //     if (err) {
            //         return next(err);
            //     }
            //     res.setHeader('Content-Type', 'application/pdf');
            //     res.setHeader(
            //         'Content-Disposition',
            //         'inline; filename"' + invoiceName + '"');
            //     res.send(data);
            // })


            // const file = fs.createReadStream(invoicePath);
            // res.setHeader('Content-Type', 'application/pdf');
            // res.setHeader(
            //     'Content-Disposition',
            //     'inline; filename"' + invoiceName + '"');
            // file.pipe(res);
        })
        .catch(err => {
            console.log(err);
        })
}





/*
call the pipe method to foreward the data that is read is with that stream to my response 
because the response object is rightable stream
and 
you can use readable streams to pipe theier output to a rightable stream and response object happens to be the rightable stream.

res will stream the data to browser and browser will download it step by step

so node has to load only chunks of data not all at once.

we forward the different chunks to browser which then is also able to concatenate the incoming data pieces into the final file.

*/