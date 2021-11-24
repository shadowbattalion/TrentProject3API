const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary')


cloudinary.config({
    'api_key': process.env.CLDNRY_API_KEY,
    'api_secret': process.env.CLDNRY_API_SECRET
})


router.get('/cldnry-sign', async (req,res)=>{
    const signature_params = JSON.parse(req.query.signature_params);
    const api_secret = process.env.CLDNRY_API_SECRET
    const signature = cloudinary.utils.api_sign_request(signature_params, api_secret);
    res.send(signature);
})






module.exports = router;