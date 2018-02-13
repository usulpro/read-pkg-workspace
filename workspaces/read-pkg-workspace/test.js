const path = require('path');
const readPkgWsp = require('./index');

/**
 * todo:
 * [x] test package in the workspace (direclty specified)
 * [x] test package in the workspace (specified by *)
 * [x] test single package
 * [] test single workspace (without package)
 * [] test package in the workspace folder but not specified in package.json/workspaces
 * [] test package inside another package folder
 * [x] test no package
 * [] test cwd
 *
 */
const rootPath = path.resolve(__dirname, '../');

const testPathSequence = (cwd, result) => {
  const summaryPath = path.resolve(
    result.path || '',
    result.workspace.name || '',
    result.package.relativePath || '',
    result.package.tailPath || '',
  );
  expect(summaryPath).toBe(cwd);
}

describe('read-pkg-workspace', () => {
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

    // expect.assertions(7);
    return readPkgWsp({ cwd })
      .then(result => {
        const pkgPath = path.resolve(rootPath, '../usual-packages/recreation-space/package.json');

        expect(result.package.path).toBe(pkgPath);
        expect(result.package.tailPath).toBeUndefined();
        expect(result.package.relativePath).toBeUndefined();
        expect(result.workspace).toEqual({});
        expect(result.workspace.name).toBeUndefined();
        // expect(result.path).toBe(path.resolve(rootPath, '../usual-packages/recreation-space/'));
        testPathSequence(cwd, result);
      })
  });

  xit('test single workspace', () => {
    const cwd = path.resolve(rootPath, 'usual-packages');

    expect.assertions(5);
    return readPkgWsp({ cwd })
      .then(result => {
        const pkgPath = path.resolve(rootPath, '../usual-packages/recreation-space/package.json');

        expect(result.package.path).toBe(pkgPath);
        expect(result.package.tailPath).toBeUndefined();
        expect(result.package.relativePath).toBeUndefined();
        expect(result.workspace).toEqual({});
        expect(result.workspace.name).toBeUndefined();
      })
  });

  it('test no package', () => {
    const cwd = path.resolve(rootPath, '../');

    expect.assertions(1);
    return readPkgWsp({ cwd })
      .then(result => {
        expect(result).toEqual({ package: {} });
      })
  });
})
