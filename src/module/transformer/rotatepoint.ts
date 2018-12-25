import MathConsts from '@app/mathconsts';


class RotatePoint {
  public static DEFAULT_ROTATE_X = 0.0;
  public static DEFAULT_ROTATE_Y = 0.0;
  public static DEFAULT_ROTATE_Z = 0.0;

  private sourceModule: any;
  // @TODO dear lord make a matrix class
  private x1matrix: number;
  private x2matrix: number;
  private x3matrix: number;
  private y1matrix: number;
  private y2matrix: number;
  private y3matrix: number;
  private z1matrix: number;
  private z2matrix: number;
  private z3matrix: number;
  private _xAngle: number;
  private _yAngle: number;
  private _zAngle: number;

  constructor(sourceModule?: any, xAngle?: number, yAngle?: number, zAngle?: number) {
    this.x1matrix = null;
    this.x2matrix = null;
    this.x3matrix = null;
    this.y1matrix = null;
    this.y2matrix = null;
    this.y3matrix = null;
    this.z1matrix = null;
    this.z2matrix = null;
    this.z3matrix = null;
    this.sourceModule = sourceModule || null;
    this.xAngle = xAngle || RotatePoint.DEFAULT_ROTATE_X;
    this.yAngle = yAngle || RotatePoint.DEFAULT_ROTATE_Y;
    this.zAngle = zAngle || RotatePoint.DEFAULT_ROTATE_Z;

    this.calcMatrices();
  }

  public get xAngle() {
    return this._xAngle;
  }
  public set xAngle(v: number) {
    this._xAngle = v;

    this.calcMatrices();
  }

  public get yAngle() {
    return this._yAngle;
  }
  public set yAngle(v: number) {
    this._yAngle = v;

    this.calcMatrices();
  }

  public get zAngle() {
    return this._zAngle;
  }
  public set zAngle(v: number) {
    this._zAngle = v;

    this.calcMatrices();
  }

  private calcMatrices() {
    let xCos = Math.cos(this.xAngle * MathConsts.DEG_TO_RAD);
    let yCos = Math.cos(this.yAngle * MathConsts.DEG_TO_RAD);
    let zCos = Math.cos(this.zAngle * MathConsts.DEG_TO_RAD);
    let xSin = Math.sin(this.xAngle * MathConsts.DEG_TO_RAD);
    let ySin = Math.sin(this.yAngle * MathConsts.DEG_TO_RAD);
    let zSin = Math.sin(this.zAngle * MathConsts.DEG_TO_RAD);

    this.x1matrix = ySin * xSin * zSin + yCos * zCos;
    this.y1matrix = xCos * zSin;
    this.z1matrix = ySin * zCos - yCos * xSin * zSin;
    this.x2matrix = ySin * xSin * zCos - yCos * zSin;
    this.y2matrix = xCos * zCos;
    this.z2matrix = -yCos * xSin * zCos - ySin * zSin;
    this.x3matrix = -ySin * xCos;
    this.y3matrix = xSin;
    this.z3matrix = yCos * xCos;
  }

  public getValue(x: number, y: number, z: number) {
    if (!this.sourceModule) {
      throw new Error('Invalid or missing source module!');
    }

    return this.sourceModule.getValue(
      (this.x1matrix * x) + (this.y1matrix * y) + (this.z1matrix * z),
      (this.x2matrix * x) + (this.y2matrix * y) + (this.z2matrix * z),
      (this.x3matrix * x) + (this.y3matrix * y) + (this.z3matrix * z),
    );
  }

  public setAngles(xAngle: number, yAngle: number, zAngle: number) {
    this.xAngle = xAngle;
    this.yAngle = yAngle;
    this.zAngle = zAngle;
  }
}

export default RotatePoint;
