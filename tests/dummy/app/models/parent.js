import E  from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  children: DS.hasMany('child', {async: false}),

  childIds: E.computed('children.@each.id', function() {
    return this
      .get('children')
      .mapBy('id');
  })
});
