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
  return  db.createTable('platforms', {
    id: { type: 'int', autoIncrement:true, primaryKey:true, unsigned:true},
    platform_name: {type: 'string', length:20},
  })
};

exports.down = function(db) {
  return db.dropTable('platforms');
};

exports._meta = {
  "version": 1
};
