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
  return db.addColumn('images', 'game_id',{
    type: 'int',
    unsigned:true,
    notNull:true,
    foreignKey: {
      name:'image_game_fk',
      table:'games',
      rules:{
        onDelete:'CASCADE',
        onUpdate:'RESTRICT'
      },
      mapping: 'id'
    }

  })
};

exports.down = function(db) {
  return db.removeColumn('images', 'game_id');
};

exports._meta = {
  "version": 1
};
