const path = require('path');
const chalk = require('chalk');
const readPkgWsp = require('./index');

/**
 * todo:
 * [x] test package in the workspace (direclty specified)
 * [x] test package in the workspace (specified by *)
 * [x] test single package
 * [x] test single workspace (without package)
 * [x] test package in the workspace folder but not specified in package.json/workspaces
 * [x] test package inside another package folder
 * [x] test no package
 * [x] test cwd
 *
 * [] check tailPath(!!!) '' or undefined?
 *
 */
const rootPath = path.resolve(__dirname, '../');
const resultsToColorize = [];

const colorize = result => {
  const output = [
    result.path,
    result.workspace.pkg ? `[${chalk.cyan(result.workspace.name)}]` : null,
    result.package.relativePath,
    result.package.pkg ? chalk.yellow(`(${result.package.pkg.name}@${result.package.pkg.version})`) : null,
    result.package.tailPath,
  ].filter(e => e).join(path.sep);
  return chalk.green(output);
}
const testPathSequence = (cwd, result) => {
  const summaryPath = path.resolve(
    result.path || '',
    result.workspace.name || '',
    result.package.relativePath || '',
    result.package.tailPath || '',
  );
  expect(summaryPath).toBe(cwd);
  resultsToColorize.push(result);
}

describe('read-pkg-workspace. use cases', () => {
  it('test package in the workspace (direclty specified)', () => {
    const cwd = path.resolve(rootPath, 'read-pkg-workspace');

    expect.assertions(7);
    return readPkgWsp({ cwd })
      .then(result => {
        const pkgPath = path.resolve(rootPath, 'read-pkg-workspace/package.json');
        const wspPath = path.resolve(rootPath, 'package.json');

        expect(result.package.path).toBe(pkgPath);
        expect(result.package.tailPath).toBe('');
        expect(result.package.relativePath).toBe('read-pkg-workspace');
        expect(result.workspace.path).toBe(wspPath);
        expect(result.workspace.name).toBe('workspaces');
        expect(result.path).toBe(path.resolve(rootPath, '../'));
        testPathSequence(cwd, result);
      })
  });

  it('test package in the workspace (specified by *)', () => {
    const cwd = path.resolve(rootPath, 'unicorns/celestabelleabethabelle/src/stories/');

    expect.assertions(7);
    return readPkgWsp({ cwd })
      .then(result => {
        const pkgPath = path.resolve(rootPath, 'unicorns/celestabelleabethabelle/package.json');
        const wspPath = path.resolve(rootPath, 'package.json');

        expect(result.package.path).toBe(pkgPath);
        expect(result.package.tailPath).toBe('src/stories');
        expect(result.package.relativePath).toBe('unicorns/celestabelleabethabelle');
        expect(result.workspace.path).toBe(wspPath);
        expect(result.workspace.name).toBe('workspaces');
        expect(result.path).toBe(path.resolve(rootPath, '../'));
        testPathSequence(cwd, result);
      })
  });

  it('test single package', () => {
    const cwd = path.resolve(rootPath, '../usual-packages/recreation-space/src/');

    expect.assertions(7);
    return readPkgWsp({ cwd })
      .then(result => {
        const pkgPath = path.resolve(rootPath, '../usual-packages/recreation-space/package.json');

        expect(result.package.path).toBe(pkgPath);
        expect(result.package.tailPath).toBe('src');
        expect(result.package.relativePath).toBeUndefined();
        expect(result.workspace).toEqual({});
        expect(result.workspace.name).toBeUndefined();
        expect(result.path).toBe(path.resolve(rootPath, '../usual-packages/recreation-space/'));
        testPathSequence(cwd, result);
      })
  });

  it('test package not specified in workspaces', () => {
    const cwd = path.resolve(rootPath, 'usual-packages/recreation-space/src/');

    expect.assertions(7);
    return readPkgWsp({ cwd })
      .then(result => {
        const pkgPath = path.resolve(rootPath, 'usual-packages/recreation-space/package.json');

        expect(result.package.path).toBe(pkgPath);
        expect(result.package.tailPath).toBe('src');
        expect(result.package.relativePath).toBeUndefined();
        expect(result.workspace).toEqual({});
        expect(result.workspace.name).toBeUndefined();
        expect(result.path).toBe(path.resolve(rootPath, 'usual-packages/recreation-space/'));
        testPathSequence(cwd, result);
      })
  });

  it('test nested packages', () => {
    const cwd = path.resolve(rootPath, 'usual-packages/recreation-space/node_modules/read-pkg/');

    expect.assertions(7);
    return readPkgWsp({ cwd })
      .then(result => {
        const pkgPath = path.resolve(rootPath, 'usual-packages/recreation-space/node_modules/read-pkg/package.json');

        expect(result.package.path).toBe(pkgPath);
        expect(result.package.tailPath).toBe('');
        expect(result.package.relativePath).toBeUndefined();
        expect(result.workspace).toEqual({});
        expect(result.workspace.name).toBeUndefined();
        expect(result.path).toBe(path.resolve(rootPath, 'usual-packages/recreation-space/node_modules/read-pkg/'));
        testPathSequence(cwd, result);
      })
  });

  it('test single workspace', () => {
    const cwd = path.resolve(rootPath, 'usual-packages');

    expect.assertions(6);
    return readPkgWsp({ cwd })
      .then(result => {
        const wspPath = path.resolve(rootPath, 'package.json');

        expect(result.workspace.path).toBe(wspPath);
        expect(result.workspace.name).toBe('workspaces');
        expect(result.package.tailPath).toBe('usual-packages');
        expect(result.package.relativePath).toBeUndefined();
        expect(result.path).toBe(path.resolve(rootPath, '../'));
        testPathSequence(cwd, result);
      })
  });

  it('test no package', () => {
    const cwd = path.resolve(rootPath, '../');

    expect.assertions(4);
    return readPkgWsp({ cwd })
      .then(result => {
        expect(result.package).toEqual({});
        expect(result.workspace).toEqual({});
        expect(result.path).toBe(cwd);
        testPathSequence(cwd, result);
      })
  });
})

describe('read-pkg-workspace. color output', () => {
  it('visual tests:', () => {
    expect.assertions(7);
    resultsToColorize.forEach(result => {
      expect(() => process.stdout.write(`\t${colorize(result)}\n`)).not.toThrow();
    })
    process.stdout.write(`\n\n`);

  });
})

describe('read-pkg-workspace. current folder', () => {
  it('shold use cwd by default', () => {
    const cwd = process.cwd();

    expect.assertions(7);
    return readPkgWsp()
    .then(result => {
      const wspPath = path.resolve(rootPath, 'package.json');

      expect(result.package.pkg).toBeUndefined();
      expect(result.package.relativePath).toBeUndefined();
      expect(result.package.tailPath).toBe('');
      expect(result.workspace.path).toBe(wspPath);
      expect(result.workspace.name).toBe('workspaces');
      expect(result.path).toBe(path.resolve(rootPath, '../'));
      testPathSequence(cwd, result);
      })
  });
})
