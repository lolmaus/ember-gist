import E from 'ember';
import FM   from 'npm:front-matter';
import Yaml from 'npm:yamljs';

export default E.Route.extend({

  beforeModel () {
    return this
      .session
      .fetch()
      .catch(()=>{});
  }
});
