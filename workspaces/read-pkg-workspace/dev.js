const readPkgUp = require('read-pkg-up');
const readPkgWsp = require('./index');
const chalk = require('chalk');

// readPkgWsp({ cwd: '/home/usulpro/WebProjects/workspaces/unicorns/celestabelleabethabelle/src/stories' })

readPkgWsp({ cwd: '/home/usulpro/WebProjects/Hyper/react-cdk/packages/cdk-scripts/scripts/utils/' })

// readPkgWsp({ cwd: '/home/usulpro/WebProjects/workspaces/read-pkg-workspace/' })

// readPkgWsp({ cwd: '/home/usulpro/WebProjects/workspaces/' })

// readPkgWsp({ cwd: '/home/usulpro/WebProjects/' })
  .then(result => {
    console.log(result);
    console.log();

    // console.log(`[${chalk.blue(result.workspace.name)}]/${chalk.green(result.package.relativePath)}/${chalk.yellow(result.package.pkg.name)}@${chalk.yellow(result.package.pkg.version)}`)

    const output = [
      '[',
      chalk.cyan(result.workspace.name),
      ']',
      '/',
      result.package.relativePath,
      '/',
      chalk.yellow(`(${result.package.pkg.name}@${result.package.pkg.version})`),
      '/',
      result.package.tailPath,
    ].join('');

    console.log(chalk.green(output));
  })


it('should work', () => {
  console.log('ok');
})
