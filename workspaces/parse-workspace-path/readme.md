# parse-workspace-path
> Parses arbitrary path string considering the presence of packages and workspaces

- Supports Yarn [workspaces](https://yarnpkg.com/en/docs/workspaces)
- Based on [read-pkg-up](https://www.npmjs.com/package/read-pkg-up) and [path.parse](https://nodejs.org/dist/latest-v9.x/docs/api/path.html#path_path_parse_path)

It returns similar object like NodeJS [path.parse](https://nodejs.org/dist/latest-v9.x/docs/api/path.html#path_path_parse_path) but adds additional if finds yarn workspaces and (or) npm packages (it should be existing path)

## Install

```sh
npm i parse-workspace-path --save
```

## Usage

```js
const parseWspPath = require('parse-workspace-path');

const absolutePath = '.../yarn-workspace-folder/packages/package-A/src/...';

parseWspPath(absolutePath)
  .then(result => console.log(result))

```
The returned object will have the following properties:

- dir `<string>`
- root `<string>`
- workspaceName `<string>`
- packageDir `<string>`
- packageName `<string>`
- packageVersion `<string>`
- localDir `<string>`
- base `<string>`
- name `<string>`
- ext `<string>`

```js
┌─────────────────────┬───────────┬─────────────────────┬──────────────┬────────────┐
│         .dir        │.workspace │   .packageDir       │  .localDir   │   .base    │
│                     │   name    │                     │              │            │
├──────┐              ├───────────┼─────────────────────┼──────────────┼──────┬─────┤
│.root │              │           │                     │              │.name │.ext │
│' /    home/user/dir / monorepo  / lib/addons/packageA / src/__test__ / file  .txt'│
│      │              │           │                   ↳'/ package.json'│      │     │
│      │              │        ↳ '/ package.json'       │              │      │     │
└──────┴──────────────┴───────────┴─────────────────────┴──────────────┴──────┴─────┘
                                       ⇧⇧⇧                   ⇧⇧⇧
                               ╭──── workspace ───╮  ╭──── package ─────╮
                               │ "private": true  │  │  (.packageName)  │
                               │ "workspaces": [] │  │ (.packageVersion)│
                               ╰──────────────────╯  ╰──────────────────╯
```

### Notice

- `base`, `name` and `ext` will be empty strings if `absolutePath` points to a dir
- `packageDir` is a relative path between workspace folder and a package folder. It will be an empty string if one of them is absent
- `dir` path to the folder:
 - 1) that contain a workspace folder (not including workspace folder itself)
 - 2) of a package if no workspace is found
 - 3) that `absolutePath` points if neither a package nor a workspace were found. Never includes a file name.
- `localDir` is a remaining part of path between package folder (or workspace folder) and a end point specified by `absolutePath`. Never includes a file name.

> You can rely on that `dir` + `workspace` + `packageDir` + `localDir` + `base` is always equal to `absolutePath`. See examples for details.

### Example

```js
const absolutePath = '/home/usulpro/WebProjects/read-pkg-workspace/workspaces/unicorns/celestabelleabethabelle/src/stories/unicorn.story.js';

parseWspPath(absolutePath)
  .then(result => console.log(result))

```

will output:

```console
{
  root: '/',
  dir: '/home/usulpro/WebProjects/read-pkg-workspace',
  localDir: 'src/stories',
  base: 'unicorn.story.js',
  ext: '.js',
  name: 'unicorn.story',
  workspaceName: 'workspaces',
  packageDir: 'unicorns/celestabelleabethabelle',
  packageName: 'celestabelleabethabelle',
  packageVersion: '1.0.0'
}

```

Take a look on some other visual examples:

[![color output](https://github.com/UsulPro/read-pkg-workspace/raw/master/doc/coloroutput.png)](https://github.com/UsulPro/read-pkg-workspace/raw/master/doc/coloroutput.png)
