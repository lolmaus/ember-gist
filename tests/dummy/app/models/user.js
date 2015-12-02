import DS from 'ember-data';
import E from 'ember';

export default DS.Model.extend({
  login:     DS.attr('string'),
  avatarUrl: DS.attr('string'),

  avatarUrl32: E.computed('avatarUrl', function() {
    return this.get('avatarUrl') + '&s=32';
  })
});
