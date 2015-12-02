import E from 'ember';

export default E.Component.extend({

  // ----- Overridden properties -----
  classNames: ['logInOut'],

  // ----- Services -----
  session: E.inject.service()
});
