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
  const summaryPath = path.resolve(
    result.dir,
    result.workspaceName,
    result.packageDir,
    result.localDir,
    result.base,
  );
  expect(summaryPath).toBe(cwd);
  resultsToColorize.push(result);
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
    process.stdout.write([
      chalk.gray('\nLegend:\t'),
      chalk.green('dir/['),
      chalk.cyan('workspace'),
      chalk.green(']/'),
      chalk.greenBright('packageDir/'),
      chalk.yellow('(packageName@packageVersion)'),
      chalk.white('/localDir/'),
      chalk.magenta('base'),
      '\n\n',
    ].join(''))
    resultsToColorize.forEach(result => {
      expect(() => process.stdout.write(`\t${colorize(result)}\n`)).not.toThrow();
    })
    process.stdout.write(`\n\n`);

  });
})

