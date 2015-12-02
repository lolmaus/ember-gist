import E from 'ember';
import _ from 'lodash';

export default E.Controller.extend({

  model: null,

  session: E.inject.service(),
  config:  E.inject.service(),
  store:   E.inject.service(),

  parentIds: E.computed('model.parents.[]', function() {
    const ids =
      this
        .get('model.parents')
        .mapBy('id');

    ids.unshiftObject('none');
    return ids;
  }),

  childIds: E.computed('model.children.[]', function() {
    return this
      .get('model.parents')
      .mapBy('id');
  }),

  actions: {
    fetch () {
      this.get('store').findAll('parent');
    },

    selectParent (child, newParentId) {
      const newParent =
        newParentId === 'none'
        ? null
        : this.get('store').peekRecord('parent', newParentId);

      child.set('parent', newParent);
    },

    saveChild (child) {
      child.save();
    },

    selectChildren (parent, newChildIds) {
      const newChildren =
        this
          .get('model.children')
          .filter(ch => _.contains(newChildIds, ch.get('id')));

      parent.set('children', newChildren);
    },

    saveParent (parent) {
      parent.save();
    }
  }
});
