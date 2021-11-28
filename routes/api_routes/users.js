const express = require('express')
const router =express.Router()

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const {User} = require("../../models")
const {auth_check_api} = require('../../middleware')



const password_hash = (password) => {return crypto.createHash('sha256').update(password).digest('base64')}
function create_token (user, secret_key, expiry){
    return jwt.sign({'id':user.id,'email':user.email,'display_name':user.display_name}, secret_key ,{'expiresIn':expiry})
}



router.post('/user-login', async (req,res)=>{

    
            
    let user_email = await User.where({
        'email': req.body.display_name_email
    }).fetch({
        require:false
    })

    let user_display_name = await User.where({
        'display_name': req.body.display_name_email
    }).fetch({
        require:false
    })
  
    
    
           
    if(!user_email && !user_display_name){
                
        res.json({
            'error':'Wrong email or password'
        })

    }else{
                
        let user = null

        if(user_email){
            console.log(user_email.toJSON())
            user=user_email
        }else if(user_display_name){
            console.log(user_display_name.toJSON())
            user=user_display_name
        }
                
                

        if (user.get('password') === password_hash(req.body.password)) {

                    let access_token = create_token(user.toJSON(), process.env.TOKEN_SECRET,'1h')
                    res.send(access_token)

                } else {
                    res.json({
                        'error':'Wrong email or password'
                    })
                }


            }
            

})



router.get('/user-profile', [auth_check_api], (req, res) => {

    let user = req.user

    res.json({
        user
    }) 



})


module.exports = router