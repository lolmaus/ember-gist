import E from 'ember';

export default E.Route.extend({

  model () {
    return E.RSVP.hash({
      parents: this.store.peekAll('parent'),
      children: this.store.peekAll('child')
    })
  }
});
