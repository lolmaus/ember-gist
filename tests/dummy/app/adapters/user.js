import DS from 'ember-data';
import E  from 'ember';

import ENV from '../config/environment';

export default DS.RESTAdapter.extend({
  config: E.inject.service(),

  host: E.computed.alias('config.githubApiUrl'),

  headers: E.computed('session.token', function() {
    const token  = this.get('session.token') || ENV.TMP_TORII_TOKEN;

    return {
      Accept:        'application/vnd.github.v3+json',
      Authorization: token ? `token ${token}` : undefined
    };
  }),

  shouldReloadAll()    { return true; },
  shouldReloadRecord() { return true; },

  urlForFindRecord: function(id, typeKey) {
    if( id === 'current' ) {
      const url = this._buildURL(typeKey);
      return url.substring(0, url.length-1);
    }

    return this._buildURL(typeKey, id);
  }
});
