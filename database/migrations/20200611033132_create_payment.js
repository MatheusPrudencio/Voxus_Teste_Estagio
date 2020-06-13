exports.up = function(knex) {
    return knex.schema.createTable('payments', (table) => {
        table.increments();
        table.string('title',100).notNullable();
        table.decimal('value').notNullable();
        table.date('date').notNullable();
        table.decimal('externalTax').notNullable();
        table.string('comments');   
    })
  };
  
exports.down = function(table) {
    return knex.schema.dropTable('payments')
  };