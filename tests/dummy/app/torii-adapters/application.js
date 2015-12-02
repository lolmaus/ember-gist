import E    from 'ember';
import ajax from 'ic-ajax';

import ENV from '../config/environment';

const LSTokenItemName = 'torii-gh-session';

export default E.Object.extend({  /**
   * Resolve the user over the Github API using the access_token
   * @param  access_token      API access_token (either from Cookie or Oauth)
   * @return Promise
   */
  resolveUser (access_token) {
    ENV.TMP_TORII_TOKEN = access_token;

    return this.store.find('user', 'current').then((user) => {
      ENV.TMP_TORII_TOKEN = null;
      localStorage.setItem(LSTokenItemName, access_token);
      return {currentUser: user, token: access_token};
    });
  },

  /**
   * Try loading the user from cookie
   * @return Promise
   */
  fetch () {
    const token = localStorage.getItem(LSTokenItemName);

    console.log('token', token)

    if(E.isBlank(token)) { return E.RSVP.reject(); }

    return this.resolveUser(token);
  },

  /**
   * Open a new session, authenticate with Github
   * @return Promise
   */
  open (authorization) {
    return ajax({
      url:      ENV.githubOauthUrl + authorization.authorizationCode,
      dataType: 'json'
    })
      .then(result => {
        if (result.error) {
          const error = `Gatekeeper failed: ${result.error}`;
          console.error(error);
          throw error;
        }
        return this.resolveUser(result.token)
      });
  },


  /**
   * Close a session
   * @return Promise
   */
  close () {
    localStorage.removeItem(LSTokenItemName);
    return E.RSVP.resolve();
  }
});
