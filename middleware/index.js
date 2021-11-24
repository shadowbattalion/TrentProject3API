



const auth_check = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        req.flash('error_flash', 'Please login first to view this page')
        res.redirect('/users/user-login')
    }
}





module.exports = {auth_check}