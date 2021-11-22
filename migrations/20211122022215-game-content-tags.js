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
  return db.createTable('content_tags_games',{
    id: { type: 'int', primaryKey: true, unsigned:true, autoIncrement: true },
    game_id:{
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'content_tags_games_game_fk',
        table: 'games',
        mapping: 'id',
        rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT'
        }        
      }
    },
    content_tag_id:{
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'content_tags_games_content_tag_fk',
        table: 'content_tags',
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
  return db.dropTable('game_content_tags');
};

exports._meta = {
  "version": 1
};
