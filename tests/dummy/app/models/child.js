import DS from 'ember-data';

export default DS.Model.extend({
  parent: DS.belongsTo('parent', {async: false})
});
