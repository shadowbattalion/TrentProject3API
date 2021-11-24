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
  return db.createTable('users',{
    id: { type: 'int', unsigned:true, primaryKey:true, autoIncrement:true},
    email: {type: 'string', length:200},
    display_name: { type: 'string', length:50},
    password: {type: 'string', length:100},
    device_specs: { type: 'string', length:600}
  })

}

exports.down = function(db) {
  return db.dropTable('users')
};

exports._meta = {
  "version": 1
};
