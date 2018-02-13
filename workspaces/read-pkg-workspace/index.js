const readPkgUp = require('read-pkg-up');
const path = require('path');

module.exports = opts => {

  return readPkgUp(opts)
    .then(result => {
      if (result.pkg) { /* package.json exist */
        const upperFolder = path.resolve(result.path, '../../');
        const cwd = opts ? opts.cwd || process.cwd() : process.cwd();
        const tailPath = path.relative(path.parse(result.path).dir, cwd);
        return readPkgUp({cwd: upperFolder})
          .then(upResult => {
            if (upResult.pkg) { /* workspace exist */

              /* todo: check workspace */
              return {
                package: {
                  ...result,
                  tailPath,
                  relativePath: path.parse(path.relative(path.parse(upResult.path).dir, result.path)).dir,
                  },
                workspace: {
                  ...upResult,
                  name: path.parse(upResult.path).dir.split(path.sep).pop(),
                  },
                path: path.resolve(upResult.path, '../../'),
              };
            } else { /* single package or single workspace */
              if (result.pkg.hasOwnProperty('workspaces')
                && result.pkg.hasOwnProperty('private')
                && result.pkg.private) { /* single workspace */

                return {
                  package: result,
                  workspace: upResult, // {}
                  path: path.resolve(result.path, '../../')
                };
              } else { /* single package */
                return {
                  package: result,
                  workspace: upResult, // {}
                  path: path.resolve(result.path, '../')
                };

              }
            }
          })
      } else {
        return { package: result };
      }

    })
    .catch(err => {
      console.log('Catch Error:')
      console.log(err)
      return {path: 'nothig'};
    })

	// return findUp('package.json', opts).then(fp => {
	// 	if (!fp) {
	// 		return {};
	// 	}

	// 	return readPkg(fp, opts).then(pkg => ({pkg, path: fp}));
	// });
};
