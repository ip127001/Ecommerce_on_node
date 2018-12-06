const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add-Product',
        path: '/admin/add-product',
    })
    // res.sendFile(path.join(dirName, 'views', 'add-product.html'));
};

exports.postAddProduct = (req, res) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    let newProduct = new Product(title, imageUrl, price, description);
    newProduct.save();

    // console.log('title', req.body.title);
    res.redirect('/products');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        })
    })
}