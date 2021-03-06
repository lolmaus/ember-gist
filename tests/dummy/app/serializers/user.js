import DS from 'ember-data';

export default DS.JSONSerializer.extend(DS.EmbeddedRecordsMixin, {
  isNewSerializerAPI: true,
  keyForAttribute: function(key) {
    return Ember.String.decamelize(key);
  },

  keyForRelationship: function(key) {
    return Ember.String.decamelize(key);
  }
});
