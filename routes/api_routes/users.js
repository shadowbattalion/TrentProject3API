const express = require('express')
const router =express.Router()

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const {User, BlackList} = require("../../models")
const {auth_check_api,refresh_check_api} = require('../../middleware')



const password_hash = (password) => {return crypto.createHash('sha256').update(password).digest('base64')}
function create_token (user, secret_key, expiry){
    return jwt.sign({'id':user.id,'email':user.email,'display_name':user.display_name}, secret_key ,{'expiresIn':expiry})
}



router.post('/user-reg', async (req,res)=>{

    
    let user_display_name = await User.where({
        'display_name': req.body.display_name
    }).fetch({
        require:false
    })


    let user_email = await User.where({
        'email': req.body.email  
    }).fetch({
        require:false
    })

    
  
    
    // console.log(req.body.display_name, req.body.password, req.body.email, req.body.device_specs)
           
    if(user_email || user_display_name){
                
        res.json({
            'message':'Display name or email already exists'
        })

    }else{
         
        const user = new User({
            "display_name":req.body.display_name,
            "password":password_hash(req.body.password),
            "email":req.body.email,
            "device_specs":req.body.device_specs,
            "user_roles":"customer",
        })
        await user.save() 

        res.json({
            'message':'User registered'
        })


        }
            

}) 



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
            user=user_email
        }else if(user_display_name){
            user=user_display_name
        }
                
                

        if (user.get('password') === password_hash(req.body.password)) {

                    let access_token = create_token(user.toJSON(), process.env.TOKEN_SECRET,'1h')
                    let refresh_token = create_token(user.toJSON(), process.env.REFRESH_TOKEN_SECRET,'3w')
                    res.json({access_token,refresh_token})
                } else {
                    res.json({
                        'error':'Wrong email or password'
                    })
                }


            }
            

})


router.post('/user-refresh', [refresh_check_api], async (req,res)=>{

    const black_list_tokens = await BlackList.where({
        'token':req.body.refresh_token
    }).fetch({
        'require':false
    })
    
    if(black_list_tokens){
        res.status(401)
        res.json({
            'message':"This token has already expired"
        })
    } else {

        let access_token = create_token(req.user, process.env.TOKEN_SECRET,'1h') // front end must send the refresh request before the access_token expires for seamless experience over long periods
        res.json({access_token})

    }

    
    
})





router.post('/user-logout', [refresh_check_api], async (req,res)=>{

    
    const black_list_token = new BlackList({'token':req.body.refresh_token, 'date': new Date()})
    await black_list_token.save()
    res.json({
        'message':"Logged out successfully!"
    })


})



router.get('/user-profile', [auth_check_api], (req, res) => {

    let user = req.user

    res.json({
        user
    }) 



})


module.exports = router