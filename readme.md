# @ladrillo/upgrade-deps

## About

Little script to

1. Delete the `node_modules` folder
2. Delete the `package-lock.json` file
3. Upgrade the dependencies of the project using `ncu`
4. Generate a new lockfile
5. Commit and and push to the `main` branch
6. Execute the tests of the project

## Using @ladrillo/upgrade-deps

```bash
npx @ladrillo/upgrade-deps@latest
```
