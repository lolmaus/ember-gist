import AppSer from './application';

export default AppSer.extend({
  attrs: {
    children: {
      serialize: true
    }
  }
});
