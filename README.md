# repo-depot

Grabs information about your Github repos.

## Getting Started

Install dependencies with: `npm install`

## Sample commands

```
# List all repos
echo -n filamentgroup | node bin/run.js repos list

# List number of open issues per repo
echo -n filamentgroup | node bin/run.js repos list | node bin/run.js issues open
```