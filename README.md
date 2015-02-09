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

## Advanced commands

```bash
# Check the files at in the root of `master` against a specified list `required.txt`
diff \
  <(echo -n "filamentgroup/shoestring" | node bin/run.js filesg list | sort) \
  <(cat required.txt | sort)\
  | grep ">"

# Get the author in package.json
sha=$(
  echo -n "filamentgroup/shoestring/package.json" \
  | node bin/run.js files json \
  | jq -r .sha
);

echo -n "filamentgroup/shoestring/$sha" \
  | node bin/run.js blob out \g
  | jq -r .author.name
```
