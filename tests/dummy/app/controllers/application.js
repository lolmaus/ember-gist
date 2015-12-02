import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    signInViaGithub () {
      this.session.open('github-oauth2').catch(function (error) {
        alert('Could not sign you in: ' + error.message);
        throw error;
      });
    },

    signOut () {
      this.session.close();
    }
  }
});
