const path = require('path');
const fs = require('fs');

const readPkgWsp = require('read-pkg-workspace');

module.exports = absolutePath => {
  return readPkgWsp({ cwd: absolutePath }).then(result => {
    const isFile = fs.statSync(absolutePath).isFile();

    const local = path.parse(result.package.tailPath || '');
    return {
      root: path.parse(result.path).root,
      dir: result.path,
      workspaceName: result.workspace.name || '',
      packageDir: result.package.relativePath || '',
      packageName: result.package.pkg ? result.package.pkg.name : '',
      packageVersion: result.package.pkg ? result.package.pkg.version : '',
      localDir: local.dir,
      base: local.base,
      ext: local.ext,
      name: local.name,
    }

  })
}