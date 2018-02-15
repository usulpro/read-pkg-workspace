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

const absoluteDir = '.../yarn-workspace-folder/packages/package-A/src/...';

parseWspPath(absoluteDir)
  .then(result => console.log(result))

```
The returned object will have the following properties:

- dir <string>
- root <string>
- workspaceName <string>
- packageDir <string>
- packageName <string>
- packageVersion <string>
- localDir <string>
- base <string>
- name <string>
- ext <string>

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

If you parse the path which **don't contain** any `package.json` files the result will be exactly same as when you use `path.parse(path)`

