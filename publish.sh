#/usr/bin/bash

pwd
rm -rfv public

command -v zola >/dev/null
if [[ $? -ne 0 ]]; then
  echo "cannot find zola; quitting"
  exit 1
fi

zola build
cd public
git init
git remote add origin https://github.com/chemio9/chemio9.github.io

git add .
git commit -am "update"
git branch gh-pages
git push -f -u origin gh-pages
