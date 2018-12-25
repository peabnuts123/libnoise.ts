import Sphere from '@app/model/sphere';
import NoiseMap from '@app/noisemap';

class NoiseMapBuilderSphere {
  private sourceModule: any;
  private width: number;
  private height: number;
  private noiseMap: NoiseMap;
  private _eastLonBound: number;
  private _northLatbound: number;
  private _southLatBound: number;
  private _westLonBound: number;

  constructor(sourceModule?: any, width?: number, height?: number) {
    this.sourceModule = sourceModule || null;
    this.width = width || 256;
    this.height = height || 256;

    this.northLatBound = 0.0;
    this.southLatBound = 0.0;
    this.eastLonBound = 0.0;
    this.westLonBound = 0.0;

    this.noiseMap = new NoiseMap(this.width, this.height);
  }

  public get eastLonBound() {
    return this._eastLonBound;
  }
  public set eastLonBound(v: number) {
    if (v <= this.westLonBound) {
      throw new Error('Lower bound cannot equal or exceed east bound!');
    }

    this._eastLonBound = v;
  }

  public get northLatBound() {
    return this._northLatbound;
  }
  public set northLatBound(v: number) {
    if (v <= this.southLatBound) {
      throw new Error('Lower bound cannot equal or exceed east bound!');
    }

    this._northLatbound = v;
  }

  public get southLatBound() {
    return this._southLatBound;
  }
  public set southLatBound(v: number) {
    if (v >= this.northLatBound) {
      throw new Error('Lower bound cannot equal or exceed east bound!');
    }

    this._westLonBound = v;
  }

  public get westLonBound() {
    return this._westLonBound;
  }
  public set westLonBound(v: number) {
    if (v >= this.eastLonBound) {

      throw new Error('Lower bound cannot equal or exceed east bound!');

    }

    this._westLonBound = v;
  }

  public build() {
    if (!this.sourceModule) {
      throw new Error('Invalid or missing module!');
    }

    // Create the cylinder model.
    let sphere = new Sphere(this.sourceModule);
    let xDelta = (this.eastLonBound - this.westLonBound) / this.width;
    let yDelta = (this.northLatBound - this.southLatBound) / this.height;
    let curLon = this.westLonBound;
    let curLat = this.eastLonBound;

    // Fill every point in the noise map with the output values from the model.
    for (let y = 0; y < this.height; y++) {

      curLon = this.westLonBound;

      for (let x = 0; x < this.width; x++) {

        this.noiseMap.setValue(x, y, sphere.getValue(curLat, curLon));

        curLon += xDelta;

      }

      curLat += yDelta;

    }

    return this.noiseMap;

  }

  public setBounds(westLonBound: number, eastLonBound: number, southLatBound: number, northLatBound: number) {
    this.westLonBound = westLonBound;
    this.eastLonBound = eastLonBound;
    this.southLatBound = southLatBound;
    this.northLatBound = northLatBound;
  }
}

export default NoiseMapBuilderSphere;
