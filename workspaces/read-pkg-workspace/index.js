const readPkgUp = require('read-pkg-up');
const micromatch = require('micromatch');
const path = require('path');

const workspaceName = result => {
  return path.parse(result.path).dir.split(path.sep).pop();
}

const tailPath = (result, cwd) => {
  return path.relative(path.parse(result.path).dir, cwd);
}

const relPath = (resultDeeper, resultUpper) => {
  return path.parse(path.relative(path.parse(resultUpper.path).dir, resultDeeper.path)).dir
}

const isWorkspace = result => {
  return result.pkg.hasOwnProperty('workspaces')
  && result.pkg.hasOwnProperty('private')
  && result.pkg.private;
}

const isMatchWorkspaces = (relativePath, ws) => {
  return micromatch.any(relativePath, ws);
}


module.exports = opts => {
  const cwd = opts ? opts.cwd || process.cwd() : process.cwd();

  return readPkgUp(opts)
    .then(result => {
      if (result.pkg) { /* project package.json exist */
        const upperFolder = path.resolve(result.path, '../../');
        // const tailPath = path.relative(path.parse(result.path).dir, cwd);
        return readPkgUp({cwd: upperFolder})
          .then(upResult => {

            if (upResult.pkg) { /* workspace package.json exist */
              const relativePath = relPath(result, upResult);

              if (isWorkspace(upResult)) { /* is it really workspace? */

                if (isMatchWorkspaces(relativePath, upResult.pkg.workspaces)) {
                  /* if this deep package is specified in "workspaces" of upper package */
                  return {
                    package: {
                      ...result,
                      tailPath: tailPath(result, cwd),
                      relativePath,
                      },
                    workspace: {
                      ...upResult,
                      name: workspaceName(upResult),
                      },
                    path: path.resolve(upResult.path, '../../'),
                  };
                } else {

                  /* it's just single package nested in another package with workspaces */
                  // todo: try to merge these two branches
                  return {
                    package: {
                      ...result,
                      tailPath: tailPath(result, cwd),
                    },
                    workspace: {},
                    path: path.resolve(result.path, '../')
                  };

                }
              } else {
                /* it's just single package nested in another package */
                return {
                  package: {
                    ...result,
                    tailPath: tailPath(result, cwd),
                  },
                  workspace: {},
                  path: path.resolve(result.path, '../')
                };

              }
            } else { /* single package or single workspace */
              if (isWorkspace(result)) {

                /* single workspace */
                return {
                  workspace: {
                    ...result,
                    name: workspaceName(result),
                  },
                  package: { tailPath: tailPath(result, cwd) },
                  path: path.resolve(result.path, '../../')
                };
              } else {

                /* single package */
                return {
                  package: {
                    ...result,
                    tailPath: tailPath(result, cwd),
                  },
                  workspace: upResult, // {}
                  path: path.resolve(result.path, '../')
                };

              }
            }
          })
      } else {
        /* no one package.json */
        return {
          package: result,
          workspace: {},
          path: cwd,
        };
      }

    })
    // .catch(err => {
    //   console.log('Catch Error:')
    //   console.log(err)
    //   return {path: 'nothig'};
    // })

	// return findUp('package.json', opts).then(fp => {
	// 	if (!fp) {
	// 		return {};
	// 	}

	// 	return readPkg(fp, opts).then(pkg => ({pkg, path: fp}));
	// });
};
