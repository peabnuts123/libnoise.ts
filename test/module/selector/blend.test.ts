import { expect } from 'chai';
import { describe, it } from 'mocha';

import { Const } from '@app/module/generator';
import { Blend } from '@app/module/selector';

describe('module/selector/blend', () => {
  it("can construct successfully", () => {
    // Setup
    const sourceValueA = 2;
    const sourceModuleA = new Const(sourceValueA);
    const sourceValueB = 2;
    const sourceModuleB = new Const(sourceValueB);
    const controlValue = 0.5;
    const controlModule = new Const(controlValue);

    // Test
    const testFunc = () => {
      new Blend([sourceModuleA, sourceModuleB], controlModule);
    };

    // Assert
    expect(testFunc).not.to.throw();
  });

  it("calling getValue with 0 sourceModules throws an error", () => {
    // Setup
    const x = 10;
    const y = 10;
    const z = 10;
    const controlValue = 0.5;
    const controlModule = new Const(controlValue);
    const mockModule = new Blend([], controlModule);

    // Test
    const testFunc = () => {
      mockModule.getValue(x, y, z);
    };

    // Assert
    expect(testFunc).to.throw();
  });

  it("calling getValue with 1 sourceModule throws an error", () => {
    // Setup
    const x = 10;
    const y = 10;
    const z = 10;
    const sourceValueA = 2;
    const sourceModuleA = new Const(sourceValueA);
    const controlValue = 0.5;
    const controlModule = new Const(controlValue);
    const mockModule = new Blend([sourceModuleA], controlModule);

    // Test
    const testFunc = () => {
      mockModule.getValue(x, y, z);
    };

    // Assert
    expect(testFunc).to.throw();
  });

  it("calling getValue with no controlModule throws an error", () => {
    // Setup
    const x = 10;
    const y = 10;
    const z = 10;
    const sourceValueA = 2;
    const sourceModuleA = new Const(sourceValueA);
    const sourceValueB = 2;
    const sourceModuleB = new Const(sourceValueB);
    const mockModule = new Blend([sourceModuleA, sourceModuleB]);

    // Test
    const testFunc = () => {
      mockModule.getValue(x, y, z);
    };

    // Assert
    expect(testFunc).to.throw();
  });

  it("calling getValue returns a number", () => {
    // Setup
    const x = 10;
    const y = 10;
    const z = 10;
    const mockModule = createMockModule();

    // Test
    const value = mockModule.getValue(x, y, z);

    // Assert
    expect(value).to.be.ok;
  });
});

function createMockModule() {
  const sourceValueA = 2;
  const sourceModuleA = new Const(sourceValueA);
  const sourceValueB = 2;
  const sourceModuleB = new Const(sourceValueB);
  const controlValue = 0.5;
  const controlModule = new Const(controlValue);

  return new Blend([sourceModuleA, sourceModuleB], controlModule);
}
