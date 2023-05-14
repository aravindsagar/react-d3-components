#!/usr/bin/env sh

set -e

# Figure out if we need to bump version by checking existing versions
version_in_file=$(cat package.json | jq -r '.version')
version_string="v$version_in_file"
if git ls-remote --tags | grep "$version_string" ; then
  version_string=npm version --no-git-tag-version minor
  echo "Bumping version to $version_string"
  git add package.json package-lock.json
  git commit -m "$version_string"
  git push origin $(git branch --show-current)
else
  echo "Using version $version_string"
fi

# Some backups for cleanup
git_head_hash=$(git rev-parse HEAD)
cp .gitignore .gitignore.bak

# Build the package
npm ci
npm run build

# Remove build dir from git ignore
sed -i '/build/d' .gitignore

# Tag and push
git add build/
git commit --amend --no-edit
git tag -a "$version_string" -m "Build for $version_string"
git push origin "$version_string"

# Cleanup
git reset "$git_head_hash"
cp .gitignore.bak .gitignore
rm .gitignore.bak
