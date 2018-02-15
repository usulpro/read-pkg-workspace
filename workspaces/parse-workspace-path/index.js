const path = require('path');
const fs = require('fs');

const readPkgWsp = require('read-pkg-workspace');

module.exports = absolutePath => {
  return readPkgWsp({ cwd: absolutePath }).then(result => {
    const isFile = fs.statSync(absolutePath).isFile();
    // const local = result.package.tailPath || result.path;
    // const tail = isFile ? path.parse(local) : {};

    const local = path.parse(result.package.tailPath || '');
    let subResult = {
      dir: result.path,
      localDir: local.dir,
      base: '',
      ext: '',
      name: '',
    };
    // console.log('subResult: ', subResult);

    if (isFile && !result.package.tailPath) {
      /* case when there're no one package.json and selected a file */
      const res = path.parse(result.path);
      subResult = {
        ...subResult,
        dir: res.dir,
        base: res.base,
        ext: res.ext,
        name: res.name,
      }

    } else {
      /* case when selected a dir in a package or in a workspace */
      subResult.localDir = result.package.tailPath || '';
    }

    if (isFile && result.package.tailPath) {
      /* case when selected a file in a package or in a workspace */
      const res = path.parse(result.package.tailPath);
      subResult = {
        ...subResult,
        localDir: res.dir,
        base: res.base,
        ext: res.ext,
        name: res.name,
      }
    }


    return {
      root: path.parse(result.path).root,
      ...subResult,
      // dir: result.path,
      workspaceName: result.workspace.name || '',
      packageDir: result.package.relativePath || '',
      packageName: result.package.pkg ? result.package.pkg.name : '',
      packageVersion: result.package.pkg ? result.package.pkg.version : '',
      // localDir: local.dir,
      // base: local.base,
      // ext: local.ext,
      // name: local.name,
    }

  })
}