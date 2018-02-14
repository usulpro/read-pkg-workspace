const path = require('path');
const chalk = require('chalk');
const parseWspPath = require('./index');


const rootPath = path.resolve(__dirname, '../');
const resultsToColorize = [];

const colorize = result => {
  const output = [
    result.dir,
    result.workspaceName ? `[${chalk.cyan(result.workspaceName)}]` : '',
    result.packageDir,
    result.packageName ? chalk.yellow(`(${result.packageName}@${result.packageVersion})`) : '',
    result.localDir,
    result.base,
  ].filter(e => e).join(path.sep);
  return chalk.green(output);
}
const testPathSequence = (cwd, result) => {
  console.log('CWD: ', cwd, '\n', result);
  const summaryPath = path.resolve(
    result.dir,
    result.workspaceName,
    result.packageDir,
    result.localDir,
    result.base,
  );
  expect(summaryPath).toBe(cwd);
  resultsToColorize.push(result);
}

describe('parse-workspace-path. use cases', () => {
  it('test package in the workspace (direclty specified)', () => {
    const cwd = path.resolve(rootPath, 'read-pkg-workspace');

    expect.assertions(1);
    return parseWspPath(cwd)
      .then(result => {
        testPathSequence(cwd, result);
      })
  });

  it('test package in the workspace (specified by *)', () => {
    const cwd = path.resolve(rootPath, 'unicorns/celestabelleabethabelle/src/stories/');

    expect.assertions(1);
    return parseWspPath(cwd)
      .then(result => {
        testPathSequence(cwd, result);
      })
  });

  it('test file in workspace', () => {
    const cwd = path.resolve(rootPath, 'unicorns/celestabelleabethabelle/src/stories/unicorn.story.js');

    expect.assertions(1);
    return parseWspPath(cwd)
      .then(result => {
        testPathSequence(cwd, result);
      })
  });

  it('test file in a single package', () => {
    const cwd = path.resolve(rootPath, '../usual-packages/recreation-space/src/index.js');

    expect.assertions(1);
    return parseWspPath(cwd)
      .then(result => {
        testPathSequence(cwd, result);
      })
  });

  it('test file in a package not specified in workspaces', () => {
    const cwd = path.resolve(rootPath, 'usual-packages/recreation-space/src/index.js');

    expect.assertions(1);
    return parseWspPath(cwd)
      .then(result => {
        testPathSequence(cwd, result);
      })
  });

  it('test nested packages', () => {
    const cwd = path.resolve(rootPath, 'usual-packages/recreation-space/node_modules/read-pkg/index.js');

    expect.assertions(1);
    return parseWspPath(cwd)
      .then(result => {
        testPathSequence(cwd, result);
      })
  });

  it('test single workspace', () => {
    const cwd = path.resolve(rootPath, 'usual-packages/readme.md');

    expect.assertions(1);
    return parseWspPath(cwd)
      .then(result => {
        testPathSequence(cwd, result);
      })
  });

  it('test no package', () => {
    const cwd = path.resolve(rootPath, '../readme.md');

    expect.assertions(1);
    return parseWspPath(cwd)
      .then(result => {
        testPathSequence(cwd, result);
      })
  });

})

describe('parse-workspace-path. color output', () => {
  it('visual tests:', () => {
    expect.assertions(8);
    resultsToColorize.forEach(result => {
      expect(() => process.stdout.write(`\t${colorize(result)}\n`)).not.toThrow();
    })
    process.stdout.write(`\n\n`);

  });
})

