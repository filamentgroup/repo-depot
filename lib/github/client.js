var GitHubApi = require("github");

var github = new GitHubApi({
  // required
  version: "3.0.0",
  // optional
  protocol: "https",
  host: "api.github.com",
  timeout: 5000,
  headers: {
    "user-agent": "filamondieu",
    // "Accept": "application/vnd.github.v3+json"// GitHub is happy with a unique user agent
  }
});

module.exports = github;
