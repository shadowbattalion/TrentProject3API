const jwt = require('jsonwebtoken')




const auth_check = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        req.flash('error_flash', 'Please login first to view this page')
        res.redirect('/users/user-login')
    }
}

const auth_check_api = (req, res, next) => {
    
    const header = req.headers.authorization
                   
   
    if (header) {
        
        const token_from_user  = header.split(' ')[1]
      
        jwt.verify(token_from_user, process.env.TOKEN_SECRET, (err,user)=>{
            if(err){
                res.sendStatus(403)
            } else {
                req.user = user
                next()
            }

        })

    } else {

        res.sendStatus(401)

    }

}



module.exports = {auth_check, auth_check_api}