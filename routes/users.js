const express = require("express")
const router = express.Router()


const { User } = require('../models')


const {bootstrap, create_user_reg_form} = require('../forms')




router.get('/user-reg', (req,res)=>{
    const form = create_user_reg_form()
    res.render('users/user-reg', {
        'form': form.toHTML(bootstrap)
    })
})


router.post('/user-reg', (req, res) => {
    const form = create_user_reg_form()
    form.handle(req, {
        success: async (form) => {
            let {confirm_password, ...user_data}=form.data
            const user = new User({user_data});
            await user.save();
            req.flash("success_messages", "User signed up successfully!");
            res.redirect('/users/user-login')
        },
        'error': (form) => {
            res.render('users/user-reg', {
                'form': form.toHTML(bootstrap)
            })
        }
    })
})


router.get('/user-login', (req,res)=>{
    res.render('users/user-login')
})


module.exports = router;