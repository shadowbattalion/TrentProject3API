'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('games_orders', {
    id: { type: 'int',  autoIncrement: true, unsigned: true, primaryKey: true},
    quantity: {type: 'int', unsigned:true},
    sub_total: {type:'real', unsigned:true},
    order_id: {
        type: 'int',
        unsigned: true,
        notNull: true,
        foreignKey: {
            name: 'order_items_order_fk',
            table: 'orders',
            mapping: 'id',
            rules: {
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT'
            }
        }
    },
    game_id: {
        type: 'int',
        notNull: true,
        unsigned: true,
        foreignKey: {
            name: 'order_items_game_fk',
            table: 'games',
            rules: {
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT'
            },
            mapping: 'id'
        }
    }
  })

}

exports.down = function(db) {
  return db.dropTable('games_orders')
};

exports._meta = {
  "version": 1
};
