const express = require("express")
const router = express.Router()
const crypto = require('crypto')

const { User } = require('../../models')
const {bootstrap, create_user_reg_form, create_login_form} = require('../../forms')
const {auth_check, credentials_check} = require('../../middleware')
const password_hash = (password) => {return crypto.createHash('sha256').update(password).digest('base64')}


router.get('/user-reg', (req,res)=>{
    const form = create_user_reg_form()
    res.render('users/user-reg', {
        'form': form.toHTML(bootstrap)
    })
})


router.post('/user-reg', (req, res) => {
    const form = create_user_reg_form()
    form.handle(req, {
        "success": async (form) => {
            let {confirm_password, ...user_data}=form.data
            const user = new User({
                "display_name":user_data.display_name,
                "password":password_hash(user_data.password),
                "email":user_data.email,
                "device_specs":user_data.device_specs
            })
            await user.save();
            req.flash("success_flash", `${user_data.display_name} signed up successfully! Please proceed to login!`);
            res.redirect('/users/user-login')
        },
        "error": (form) => {
            res.render('users/user-reg', {
                'form': form.toHTML(bootstrap)
            })
        }
    })
})


router.get('/user-login', (req,res)=>{
    const form=create_login_form()
    res.render('users/user-login',{
        'form': form.toHTML(bootstrap)
    })
})




router.post('/user-login', (req,res)=>{

    const form=create_login_form()

    form.handle(req, {
        "success": async (form) => {
            
            let user_email = await User.where({
                'email': form.data.display_name_email
            }).fetch({
               require:false}
            )

            let user_display_name = await User.where({
                'display_name': form.data.display_name_email
            }).fetch({
               require:false}
            )
  
           
            if(!user_email && !user_display_name){
                
                req.flash("error_flash", "Authentication Failure. Please try again.")
                res.redirect('/users/user-login')

            } else{
                
                let user = null

                if(user_email){
                    user=user_email
                }else if(user_display_name){
                    user=user_display_name
                }
                
                

                if (user.get('password') === password_hash(form.data.password)) {

                    req.session.user = {
                        display_name: user.get('display_name'),
                        email: user.get('email'),
                        device_specs: user.get('device_specs'),
                        id: user.get('id')
                    }

                    req.flash("success_flash", "Welcome back, " + user.get('display_name'));
                    res.redirect('/list-games');
                } else {
                    req.flash("error_flash", "Authentication Failure. Please try again.")
                    res.redirect('/users/user-login')
                }


            }


        },
        "error": (form) => {
            req.flash("error_flash", "Authentication Failure. Please try again.")
            res.render('users/user-login', {
                'form': form.toHTML(bootstrap)
            })
        }
    })


})

router.get('/user-profile', [auth_check], (req, res) => {

    const user_info = req.session.user
    res.render('users/user-profile',{
        'user': user_info
    })

    

})
    
router.get('/user-logout', [auth_check], (req, res) => {
    req.session.user = null;
    req.flash('success_flash', "Logged out!");
    res.redirect('/users/user-login');
})


module.exports = router;