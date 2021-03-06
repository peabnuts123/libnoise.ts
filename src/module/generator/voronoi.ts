import MathConsts from '@app/mathconsts';
import NoiseGen from '@app/noisegen';
import GeneratorModule from './GeneratorModule';

/**
 * Noise module that outputs Voronoi cells.
 *
 * In mathematics, a *Voronoi cell* is a region containing all the
 * points that are closer to a specific *seed point* than to any
 * other seed point.  These cells mesh with one another, producing
 * polygon-like formations.
 *
 * By default, this noise module randomly places a seed point within
 * each unit cube.  By modifying the *frequency* of the seed points,
 * an application can change the distance between seed points.  The
 * higher the frequency, the closer together this noise module places
 * the seed points, which reduces the size of the cells.
 *
 * This noise module assigns each Voronoi cell with a random constant
 * value from a coherent-noise function.  The *displacement value*
 * controls the range of random values to assign to each cell.  The
 * range of random values is +/- the displacement value.
 *
 * To modify the random positions of the seed points, update the seed value.
 *
 * This noise module can optionally add the distance from the nearest
 * seed to the output value.  To enable this feature, set the `distance` flag
 * to true.  This causes the points in the Voronoi cells
 * to increase in value the further away that point is from the nearest
 * seed point.
 *
 * Voronoi cells are often used to generate cracked-mud terrain
 * formations or crystal-like textures.
 *
 * This noise module requires no source modules.
 */
class Voronoi extends GeneratorModule {
  public static readonly DEFAULT_VORONOI_DISPLACEMENT = 1.0;
  public static readonly DEFAULT_VORONOI_FREQUENCY = 1.0;
  public static readonly DEFAULT_VORONOI_SEED = 0;

  /**
   * Scale of the random displacement to apply to each Voronoi cell.
   */
  private displacement: number;
  /**
   * Determines if the distance from the nearest seed point is applied to
   * the output value.
   */
  private distance: boolean;
  /**
   * Frequency of the seed points.
   */
  private frequency: number;
  /**
   * Seed value used by the coherent-noise function to determine the
   * positions of the seed points.
   */
  private seed: number;

  /**
   *
   * @param frequency Frequency of the seed points.
   * @param displacement Scale of the random displacement to apply to each Voronoi cell.
   * @param distance Determines if the distance from the nearest seed point is applied to the output value.
   * @param seed Seed value used by the coherent-noise function to determine the positions of the seed points.
   */
  constructor(frequency?: number, displacement?: number, distance?: boolean, seed?: number) {
    super();

    this.frequency = frequency || Voronoi.DEFAULT_VORONOI_FREQUENCY;
    this.displacement = displacement || Voronoi.DEFAULT_VORONOI_DISPLACEMENT;
    this.distance = distance || false;
    this.seed = seed || Voronoi.DEFAULT_VORONOI_SEED;
  }

  public getValue(x: number, y: number, z: number): number {
    // This method could be more efficient by caching the seed values.
    x = (x * this.frequency);
    y = (y * this.frequency);
    z = (z * this.frequency);

    let xPos, yPos, zPos, xDist, yDist, zDist, dist;

    let xi = Math.floor(x);
    let yi = Math.floor(y);
    let zi = Math.floor(z);
    let xInt = (x > 0.0 ? xi : xi - 1);
    let yInt = (y > 0.0 ? yi : yi - 1);
    let zInt = (z > 0.0 ? zi : zi - 1);
    let minDist = 2147483647.0;
    let xCandidate = 0;
    let yCandidate = 0;
    let zCandidate = 0;
    let value = 0.0;

    // Inside each unit cube, there is a seed point at a random position.  Go
    // through each of the nearby cubes until we find a cube with a seed point
    // that is closest to the specified position.
    for (let zCur = zInt - 2; zCur <= zInt + 2; zCur++) {
      for (let yCur = yInt - 2; yCur <= yInt + 2; yCur++) {
        for (let xCur = xInt - 2; xCur <= xInt + 2; xCur++) {
          // Calculate the position and distance to the seed point inside of
          // this unit cube.
          xPos = (xCur + NoiseGen.valueNoise3D(xCur, yCur, zCur, this.seed));
          yPos = (yCur + NoiseGen.valueNoise3D(xCur, yCur, zCur, this.seed + 1));
          zPos = (zCur + NoiseGen.valueNoise3D(xCur, yCur, zCur, this.seed + 2));
          xDist = (xPos - x);
          yDist = (yPos - y);
          zDist = (zPos - z);
          dist = (xDist * xDist + yDist * yDist + zDist * zDist);

          if (dist < minDist) {
            // This seed point is closer to any others found so far, so record
            // this seed point.
            minDist = dist;
            xCandidate = xPos;
            yCandidate = yPos;
            zCandidate = zPos;
          }
        }
      }
    }

    if (this.distance) {
      // Determine the distance to the nearest seed point.
      xDist = xCandidate - x;
      yDist = yCandidate - y;
      zDist = zCandidate - z;
      value = (Math.sqrt(xDist * xDist + yDist * yDist + zDist * zDist)) * MathConsts.SQRT_3 - 1.0;
    }

    // Return the calculated distance with the displacement value applied.
    return value + (
      this.displacement * NoiseGen.valueNoise3D(
        (Math.floor(xCandidate)),
        (Math.floor(yCandidate)),
        (Math.floor(zCandidate)),
      )
    );

  }
}

export default Voronoi;
