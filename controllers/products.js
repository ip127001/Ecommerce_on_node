const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add-Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    })
    // res.sendFile(path.join(dirName, 'views', 'add-product.html'));
};

exports.postAddProduct = (req, res) => {
    let newProduct = new Product(req.body.title)
    newProduct.save();

    console.log(req.body.title);
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll();

    console.log(products);
    res.render('shop', {
        prods: products,
        pageTitle: 'shop',
        path: '/shop',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
    // console.log(adminData.products);
    // res.sendFile(path.join(dirName, 'views', 'shop.html'));
};