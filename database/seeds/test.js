
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('payments').del()
    .then(function () {
      // Inserts seed entries
      return knex('payments').insert([
        {title: 'test_1', value: 100, date:'07/07/1996', externalTax: 5, comments:'test'},
        {title: 'test_2', value: 200, date:'07/07/1997', externalTax: 10, comments:''},
        {title: 'test_3', value: 220, date:'07/07/1998', externalTax: 11, comments:'test'}
      ]);
    });
};
