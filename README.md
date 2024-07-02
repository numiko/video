# Package Boilerplate

This package is to be used as a starting point when creating a new front-end module.

## What does it include?

- Vite
- `vitest` and `happy-dom` for testing
- CircleCI configuration
- ES Lint

## When creating a new package

### The index.html file

- Update the `title` element inside `index.html` to match the package name

### The package.json file

- Update the `name`
- Update the `description`
- Update the `version`, if necessary
- Update the `repository.url` field
- Update the `main` field
- Update the `exports` field

### The Vite config file

- Update the `build.lib` field to match that of the new package name

### Imports

- Update the package filename inside of the `lib` directory
- Update the `import` statements to match that of the new package name inside the `src/main.js` file

## Distributing a new build

- Update the version number if necessary
- Run an `npm run build` to compile the built assets
- Commit the built assets

## Circle CI

Circle CI configuration has been added to this project, however additional work needs to be done inside Circle to set the project up.
See [Circle CI documentation](https://numiko.atlassian.net/wiki/spaces/FRONTEND/pages/651460615/CircleCI+Configuration+for+FE+tests).
