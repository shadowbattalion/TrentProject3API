const { User } = require('../models')


const validate_exist_email = function (message) {
    let msg = message || 'Email has already existed.'


    let check = async function (form, field, callback) {

        let object = await User.where({
            'email': field.data
        }).fetch({
           require:false})
        
        if (object===null) {
            callback();
        } else {
            callback(msg);
        }
    }



    return check
}


const validate_exist_display_name = function (message) {
    let msg = message || 'Display name has already existed.'


    let check = async function (form, field, callback) {

        let object = await User.where({
            'display_name': field.data
        }).fetch({
           require:false})
        
        if (object===null) {
            callback();
        } else {
            callback(msg);
        }
    }



    return check
}



const validate_decimal = function(message){
    let msg = message || 'Input should be in numbers or decimals.'

    let check = async function (form, field, callback) {

        field.data
        
        if (isNaN(field.data)) {
            callback(msg)
        } else {
            callback()
        }
    }



    return check

}

module.exports = {validate_exist_email, validate_exist_display_name, validate_decimal}