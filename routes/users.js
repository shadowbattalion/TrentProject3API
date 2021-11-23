const express = require("express")
const router = express.Router()


const { User } = require('../models')


const {bootstrap, create_user_reg_form, create_login_form} = require('../forms')




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
            const user = new User(user_data);
            await user.save();
            req.flash("success_messages", `${user_data.display_name} signed up successfully! Please proceed to login!`);
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
                
                req.flash("error_messages", "Authentication Failure. Please try again.")
                res.redirect('/users/user-login')

            } else{
                
                let user = null

                if(user_email){
                    user=user_email
                }else if(user_display_name){
                    user=user_display_name
                }
                
                

                if (user.get('password') === form.data.password) {

                    req.session.user = {
                        display_name: user.get('display_name'),
                        email: user.get('email'),
                        id: user.get('id')
                    }

                    req.flash("success_messages", "Welcome back, " + user.get('display_name'));
                    res.redirect('/list-games');
                } else {
                    req.flash("error_messages", "Authentication Failure. Please try again.")
                    res.redirect('/users/user-login')
                }


            }


        },
        "error": (form) => {
            req.flash("error_messages", "Authentication Failure. Please try again.")
            res.render('users/user-login', {
                'form': form.toHTML(bootstrap)
            })
        }
    })


})


module.exports = router;