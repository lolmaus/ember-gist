import E from 'ember';

export default E.Service.extend({
  gistId:       'c120214cd2ff5196a0e6',
  githubApiUrl: 'https://api.github.com',

  gistUrl: E.computed('gistId', 'githubApiUrl', function() {
    const gistId       = this.get('gistId');
    const githubApiUrl = this.get('githubApiUrl');
    return `${githubApiUrl}/gists/${gistId}`;
  })
});
