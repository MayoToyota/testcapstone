//for normal user
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please log in before continue moving forward.');

    res.redirect('/login');
};

//for admin
exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.username === 'admin') {
        return next();
    }
    req.flash('error', 'You need to log in as an admin');

    res.redirect('/login');
};
