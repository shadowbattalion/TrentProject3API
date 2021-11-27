const express =  require('express')
const router = express.Router()

const {list_available_games_services} = require("../../services/games")


router.get('/', async (req,res)=>{

    let games = await list_available_games_services()

    res.json({
        games
    })
    
})

module.exports=router