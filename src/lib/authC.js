module.exports = {
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signinC');
    },
    isNotLoggedIn: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/profileC');
    }
};