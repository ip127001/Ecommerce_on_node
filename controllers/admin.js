const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.redirect('/login')
    }
    res.render('admin/edit-product', {
        pageTitle: 'Add-Product',
        path: '/admin/add-product',
        editing: false
    });
    // res.sendFile(path.join(dirName, 'views', 'add-product.html'));
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
        userId: req.user
    });

    product.save()
        .then(result => {
            console.log('the inserted product');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/')
            }
            res.render('admin/edit-product', {
                pageTitle: 'Add-Product',
                path: '/admin/add-product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => console.log(err));
    // res.sendFile(path.join(dirName, 'views', 'add-product.html'));
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;

    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.imageUrl = updatedImageUrl;
            product.price = updatedPrice;
            product.description = updatedDescription;
            return product.save();
        })
        .then(result => {
            // console.log('the updated product', result);
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProducts = (req, res, next) => {
    Product.find()
        // .select('title price')
        // .populate('userId', 'name') // populate certain field with all the detailed information
        .then(products => {
            // console.log(products);
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            })
        })
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
        .then(() => {
            console.log('product deleted')
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err));
}