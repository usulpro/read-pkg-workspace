const path = require('path');
const chalk = require('chalk');
const parseWspPath = require('./index');


const rootPath = path.resolve(__dirname, '../');
const resultsToColorize = [];

const colorize = result => {
  const output = [
    result.dir,
    result.workspaceName ? `[${chalk.cyan(result.workspaceName)}]` : '',
    chalk.greenBright(result.packageDir),
    result.packageName ? chalk.yellow(`(${result.packageName}@${result.packageVersion})`) : '',
    chalk.white(result.localDir),
    chalk.magenta(result.base),
  ].filter(e => e).join(path.sep);
  return chalk.green(output);
}

const testSnapshot = result => {
  const mockedDir = {
    ...result,
    dir: 'dir',
  }
  expect(mockedDir).toMatchSnapshot();
}

const testPathSequence = (cwd, result) => {
  // console.log('CWD: ', cwd, '\n\n', result);
  const summaryPath = path.join(
    result.dir,
    result.workspaceName,
    result.packageDir,
    result.localDir,
    result.base,
  );
  // console.log('summaryPath: ', summaryPath);
  resultsToColorize.push(result);
  expect(summaryPath).toBe(cwd);
  testSnapshot(result);
}

describe('parse-workspace-path. use cases', () => {
  it('test package in the workspace (direclty specified)', () => {
    const cwd = path.resolve(rootPath, 'read-pkg-workspace');

    expect.hasAssertions();
    return parseWspPath(cwd)
      .then(result => {
        testPathSequence(cwd, result);
      })
  });

  it('test package in the workspace (specified by *)', () => {
    const cwd = path.resolve(rootPath, 'unicorns/celestabelleabethabelle/src/stories/');

    expect.hasAssertions();
    return parseWspPath(cwd)
      .then(result => {
        testPathSequence(cwd, result);
      })
  });

  it('test file in workspace', () => {
    const cwd = path.resolve(rootPath, 'unicorns/celestabelleabethabelle/src/stories/unicorn.story.js');

    expect.hasAssertions();
    return parseWspPath(cwd)
      .then(result => {
        testPathSequence(cwd, result);
      })
  });

  it('test file in a single package', () => {
    const cwd = path.resolve(rootPath, '../usual-packages/recreation-space/src/index.js');

    expect.hasAssertions();
    return parseWspPath(cwd)
      .then(result => {
        testPathSequence(cwd, result);
      })
  });

  it('test file in a package not specified in workspaces', () => {
    const cwd = path.resolve(rootPath, 'usual-packages/recreation-space/src/index.js');

    expect.hasAssertions();
    return parseWspPath(cwd)
      .then(result => {
        testPathSequence(cwd, result);
      })
  });

  it('test nested packages dir', () => {
    const cwd = path.resolve(rootPath, 'usual-packages/recreation-space/node_modules/read-pkg/dist');

    expect.hasAssertions();
    return parseWspPath(cwd)
      .then(result => {
        testPathSequence(cwd, result);
      })
  });

  it('test nested packages file', () => {
    const cwd = path.resolve(rootPath, 'usual-packages/recreation-space/node_modules/read-pkg/index.js');

    expect.hasAssertions();
    return parseWspPath(cwd)
      .then(result => {
        testPathSequence(cwd, result);
      })
  });

  it('test single workspace dir', () => {
    const cwd = path.resolve(rootPath, 'usual-packages/');

    expect.hasAssertions();
    return parseWspPath(cwd)
      .then(result => {
        testPathSequence(cwd, result);
      })
  });

  it('test single workspace file', () => {
    const cwd = path.resolve(rootPath, 'usual-packages/readme.md');

    expect.hasAssertions();
    return parseWspPath(cwd)
      .then(result => {
        testPathSequence(cwd, result);
      })
  });

  it('test no package dir', () => {
    const cwd = path.resolve(rootPath, '../');

    expect.hasAssertions();
    return parseWspPath(cwd)
      .then(result => {
        testPathSequence(cwd, result);
      })
  });

  it('test no package file', () => {
    const cwd = path.resolve(rootPath, '../readme.md');

    expect.hasAssertions();
    return parseWspPath(cwd)
      .then(result => {
        testPathSequence(cwd, result);
      })
  });

  it('test nonexistent file', () => {
    const cwd = path.resolve(rootPath, 'unicorns/celestabelleabethabelle/src/stories/unicorn.story.jsx');

    expect.hasAssertions();
    return parseWspPath(cwd)
      .catch(err => {
        expect(err).toHaveProperty('code', 'ENOENT');
      })
  });

})

describe('parse-workspace-path. color output', () => {
  it('visual tests:', () => {
    expect.assertions(11);

    process.stdout.write(chalk.yellow.bgBlackBright('Color output:\n\n'));

    resultsToColorize.forEach(result => {
      expect(() => process.stdout.write(`\t${colorize(result)}\n`)).not.toThrow();
    })

    process.stdout.write([
      chalk.yellow.bgBlackBright('\nLegend:\t'),
      chalk.green('dir/['),
      chalk.cyan('workspace'),
      chalk.green(']/'),
      chalk.greenBright('packageDir/'),
      chalk.yellow('(packageName@packageVersion)'),
      chalk.white('/localDir/'),
      chalk.magenta('base'),
      '\n\n',
    ].join(''));
    process.stdout.write([
      chalk.green('dir/'),
      chalk.reset(' - path to the folder, containing a package, workspace folder or a single file\n'),
      chalk.cyan('[workspace]'),
      chalk.reset(` - workspace name = workspace folder. Will be an empty string '' if workspace is not found\n`),
      chalk.greenBright('packageDir/'),
      chalk.reset(` - relative path from workspace to package folder. If there are no package or no workspace it's ''\n`),
      chalk.yellow('(packageName@packageVersion)'),
      chalk.reset(` - is taken from a package.json file. Will be empty string '' if package is not found\n`),
      chalk.white('/localDir/'),
      chalk.reset(` - relative path from package or workspace (if there is no package) folder to the specified folder. If there are no package and no workspace it's collapsing to ''\n`),
      chalk.magenta('base'),
      chalk.reset(` - file name + file extension. If specified a dir it's an empty string\n\n`),
    ].join(''));
    process.stdout.write('\n\n');

  });
})

