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

```
# Check the files at in the root of `master`  against a specified list
diff \
  <(echo -n "filamentgroup/shoestring" | node bin/run.js filenames list | sort) \
  <(cat /tmp/check.txt | sort)\
  | grep ">"
``
