const { CartGame } = require('../models');

const get_cart = async (user_id) => {
    return await CartGame.collection()
        .where({
            user_id
        }).fetch({
            require: false,
            withRelated: ['game', 'game.category']
        });
}



const get_user_game = async (user_id, game_id) => {
    return await CartGame.where({
        user_id,
        game_id
    }).fetch({
        require: false
    });
}




async function add_game_to_cart(user_id, game_id, quantity) {

    let cartItem = new CartItem({
        user_id,
        game_id,
        quantity
    })
    await cartItem.save();
    return cartItem;
}


async function remove_game_from_cart(user_id, game_id) {
    let cart_game = await get_user_game(user_id, game_id);
    if (cart_game) {
        await cart_game.destroy();
        return true;
    }
    return false;
}



module.exports = { get_cart, get_user_game ,add_game_to_cart,remove_game_from_cart}