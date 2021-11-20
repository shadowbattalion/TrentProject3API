const express = require("express")
const router = express.Router()


const {Games} = require('../models')



router.get('/', async(req,res)=>{

    let games = await Games.collection().fetch()
    res.render('games/index',{
        'games':games.toJSON()
    })


})


module.exports = router