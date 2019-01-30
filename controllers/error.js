exports.error404 = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Error Page',
        path: '/404',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.error500 = (req, res, next) => {
    res.status(500).render('500', {
        pageTitle: 'Server Error Page',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });
}