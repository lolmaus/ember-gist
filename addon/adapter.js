import E from   'ember';
import DS from 'ember-data';
import { request } from 'ic-ajax';

export default DS.Adapter.extend({
  config:  E.inject.service(),
  session: E.inject.service(),

  findAll () {
    return request(this.get('config.gistUrl'));
  },

  createRecord (store, type, snapshot) {
    if (!snapshot.id) {
      throw `Tried to createRecord of type ${type} with no id. Clientside id required.`;
    }
    return this.updateRecord(store, type, snapshot);
  },

  deleteRecord (store, type, snapshot) {
    const serializedRecord = this.serializeRecord(snapshot, true);
    return this.persistRecord(serializedRecord);
  },

  updateRecord (store, type, snapshot) {
    const serializedRecord = this.serializeRecord(snapshot);

    if (snapshot.adapterOptions && snapshot.adapterOptions.dontPersist) {
      return null;
    }

    return this.persistRecord(serializedRecord);
  },

  serializeRecord (snapshot, destroy = false) {
    let {name, content} = this.serialize(snapshot, {includeId: true});
    const file = {};
    file[name] = destroy ? null: {content: content};
    return file;
  },


  persistRecord (file) {
    return request({
      url:         this.get('config.gistUrl'),
      type:        'PATCH',
      data:        JSON.stringify({files: file}),
      contentType: 'text/plain',
      headers: {
        Accept:        'application/vnd.github.v3+json',
        Authorization: `token ${this.get('session.token')}`
      }
    });
  }
});
