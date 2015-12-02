import DS   from 'ember-data';
import _    from 'lodash/lodash';
import FM   from 'npm:front-matter';
import Yaml from 'npm:yamljs';

export default DS.JSONAPISerializer.extend({
  normalizeResponse (store, model, payload, id, requestType) {

    if (!payload || !payload.files) { return payload; }

    const records =
      _(payload.files)
        .filter((data, name) => _.startsWith(name, 'model.'))
        .map(data => {
          const [foo, type, id] = data.filename.split('.');
          const frontmatter = FM(data.content);

          return {
            type:          Ember.String.pluralize(type),
            id:            id,
            attributes:    {...frontmatter.attributes.attributes, body: frontmatter.attributes.body},
            relationships: frontmatter.attributes.relationships
          }
        })
        .value();

    let data, included;

    if (requestType === 'deleteRecord') {
      return {meta: {}};
    }

    if (_.contains(['createRecord', 'updateRecord', 'findRecord'], requestType)) {
      [[data], included] = _.partition(records, r => r.id === id);

    } else {
      [data, included] = _.partition(records, r => r.type === (model && model.modelName));
    }

    const newPayload = {
      data:     data,
      included: included
    };

    return this._super(store, model, newPayload, id, requestType);
  },

  serialize (snapshot, options) {

    const {data: json} = this._super(snapshot, options);

    const id = json.id;
    const type = Ember.String.singularize(json.type);
    const body = json.attributes && json.attributes.body;

    delete json.id;
    delete json.type;
    if (body) {
      delete json.attributes.body;
    }

    json.attributes = {attributes: json.attributes};

    if (json.relationships) {
      json.attributes.relationships = json.relationships;
      delete json.relationships;
    }

    const yaml = Yaml.stringify(json.attributes);

    let result = `---\n${yaml}---`;

    if (body) {
      result += `\n${body}`;
    }

    return {
      name:    `model.${type}.${id}.md`,
      content: result
    };
  },

  pushPayload(store, rawPayload) {
    const normalizedPayload = this.normalizeResponse(store, null, rawPayload)
    store.push(normalizedPayload);
  }
});
