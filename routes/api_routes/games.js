const express =  require('express')
const router = express.Router()

const {list_available_games_services, list_available_games_details_services} = require("../../services/games")
const {auth_check_api} = require("../../middleware")

router.get('/', [auth_check_api], async (req,res)=>{
    
    let games = await list_available_games_services(req.query.company_name, req.query.title)

    res.json({
        games
    })
    
})


router.get('/:game_id/details', [auth_check_api], async(req,res)=>{


    let outcome = await list_available_games_details_services(req.params.game_id)
    
    if(outcome){
        res.json({
            "message":outcome
        })

    } else {

        res.json({
            "message":"No such games"
        })

    }

})




module.exports=router