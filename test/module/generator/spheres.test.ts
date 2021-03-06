import { expect } from 'chai';
import { describe, it } from 'mocha';

import { Spheres } from '@app/module/generator';

describe('module/generator/spheres', () => {
  it("can construct successfully", () => {
    // Setup
    const frequency = 2;

    // Test
    const testFunc = () => {
      new Spheres(frequency);
    };

    // Assert
    expect(testFunc).not.to.throw();
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

function createMockModule(): Spheres {
  const frequency = 2;

  return new Spheres(frequency);
}
