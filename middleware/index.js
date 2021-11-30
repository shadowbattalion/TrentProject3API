const jwt = require('jsonwebtoken')




const auth_check = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        req.flash('error_flash', 'Please login first to view this page')
        res.redirect('/users/user-login')
    }
}


const owner_required = (req, res, next) => {
        

    if (req.session.user.user_roles=="owner") {
        next()
    } else {
        req.flash('error_flash', 'Please login as an owner to view page.')
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



const refresh_check_api = (req, res, next) => {


    const token_from_user  = req.body.refresh_token
                   
   
    if (token_from_user) {
        
        jwt.verify(token_from_user, process.env.REFRESH_TOKEN_SECRET, (err,user)=>{
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



module.exports = {auth_check, owner_required, auth_check_api, refresh_check_api}