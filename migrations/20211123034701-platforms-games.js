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
  return db.createTable('games_platforms',{
    id: { type: 'int', primaryKey: true, unsigned:true, autoIncrement: true },
    game_id:{
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'platforms_games_game_fk',
        table: 'games',
        mapping: 'id',
        rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT'
        }        
      }
    },
    platform_id:{
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'platforms_games_platform_fk',
        table: 'platforms',
        mapping: 'id',
        rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT'
        }

      }
    }
  })
};

exports.down = function(db) {
  return db.dropTable('games_platforms');
};

exports._meta = {
  "version": 1
};
