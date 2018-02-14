# read-pkg-workspace
> Reads the closest two package.json files and checks if they are organized in a workspace

- Supports Yarn [workspaces](https://yarnpkg.com/en/docs/workspaces)
- Based on [read-pkg-up](https://www.npmjs.com/package/read-pkg-up)

## Install

```sh
npm i read-pkg-workspace --save
```

## Usage

```js
const readPkgWsp = require('read-pkg-up');

const dir = '.../yarn-workspace-folder/packages/package-A/src/...';

readPkgWsp({ cwd: dir })
  .then(result => console.log(result))

```

```console

  result:
    { package:
       { pkg:
          { name: 'celestabelleabethabelle',
            description: 'the unicorn',
            version: '1.0.0',
            main: 'src/index.js',
            license: 'MIT',
            keywords: [Array],
            optDependencies: [Object],
            readme: 'ERROR: No README data found!',
            _id: 'celestabelleabethabelle@1.0.0' },
         path: '/home/usulpro/WebProjects/read-pkg-workspace/workspaces/unicorns/celestabelleabethabelle/package.json',
         tailPath: 'src/stories',
         relativePath: 'unicorns/celestabelleabethabelle' },
      workspace:
       { pkg:
          { private: true,
            workspaces: [Array],
            name: '',
            version: '',
            readme: 'ERROR: No README data found!',
            _id: '@' },
         path: '/home/usulpro/WebProjects/read-pkg-workspace/workspaces/package.json',
         name: 'workspaces' },
      path: '/home/usulpro/WebProjects/read-pkg-workspace' }

```

Where

  `result.package.pkg` - is result of `read-pkg-up` for `package.json` located in the project folder

  `result.workspace.pkg` - is result of `read-pkg-up` for `package.json` located in the workspace root folder

  `result.package.relativePath` - is the relative path from workspace folder to the project folder

  `result.package.tailPath` - is the relative path from project folder to the specified in argument `cwd` folder

  `result.workspace.name` - the name of workspace root folder

  `result.path` - path to the folder that contain the workspace root folder


## This package is under development now

